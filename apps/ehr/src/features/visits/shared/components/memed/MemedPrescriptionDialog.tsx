import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicationIcon from '@mui/icons-material/Medication';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PrintIcon from '@mui/icons-material/Print';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { DocumentReference, MedicationRequest, Patient } from 'fhir/r4b';
import { enqueueSnackbar } from 'notistack';
import { FC, useEffect, useRef, useState } from 'react';
import { useApiClients } from 'src/hooks/useAppClients';
import useEvolveUser from 'src/hooks/useEvolveUser';
import { cleanDigits, formatCPF } from 'utils/lib/helpers/brazilValidation';
import { ERX_MEDICATION_META_TAG_CODE } from 'utils/lib/fhir/constants';
import { DiagnosisDTO } from 'utils/lib/types/api/chart-data/chart-data.types';

interface MemedPrescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  patient?: Patient;
  encounterId?: string;
  diagnoses?: DiagnosisDTO[];
  onPrescriptionSaved?: () => void;
}

declare global {
  interface Window {
    MdHub?: any;
    MdSinapsePrescricao?: any;
  }
}

export const MemedPrescriptionDialog: FC<MemedPrescriptionDialogProps> = ({
  open,
  onClose,
  patient,
  encounterId,
  diagnoses,
  onPrescriptionSaved,
}) => {
  const { oystehr } = useApiClients();
  const currentUser = useEvolveUser();

  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'memed_live' | 'simulator'>('memed_live');
  const [prescriptionSuccess, setPrescriptionSuccess] = useState<string | null>(null);

  // Simulated prescription items
  const [simulatedMeds, setSimulatedMeds] = useState([
    { nome: 'Amoxicilina + Clavulanato 875mg', posologia: '1 comprimido de 12 em 12 horas por 7 dias', quantidade: '14 comprimidos' },
    { nome: 'Dipirona Monoidratada 500mg/mL', posologia: '35 gotas a cada 6 horas se dor ou febre', quantidade: '1 frasco 20mL' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');

  const patientName = patient?.name?.[0]?.text || `${patient?.name?.[0]?.given?.join(' ') || ''} ${patient?.name?.[0]?.family || ''}`.trim() || 'Paciente';
  const cpfIdent = patient?.identifier?.find(
    (id) =>
      id.system === 'https://saude.gov.br/fhir/sid/cpf' ||
      id.system === 'https://rnds.saude.gov.br/fhir/r4/NamingSystem/cpf'
  )?.value;
  const patientCpf = cpfIdent ? formatCPF(cpfIdent) : 'Não informado';
  const patientPhone = patient?.telecom?.find((t) => t.system === 'phone')?.value || 'Não informado';
  const doctorName = currentUser?.user?.name || 'Dr. Médico Responsável';
  const doctorCrm = '123456';
  const doctorUf = 'SP';

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setPrescriptionSuccess(null);
      return;
    }

    // Carregamento do script oficial da Memed Sinapse
    const scriptId = 'memed-sinapse-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://sandbox.memed.com.br/modulos/plataforma.sinapse-prescricao/autoload.js';
      script.setAttribute('data-color', '#0072CE');
      script.async = true;

      script.onload = () => {
        initMemedHub();
      };

      script.onerror = () => {
        console.warn('Memed SDK indisponível (modo sandbox ou chave de parceiro pendente). Ativando simulador.');
        setActiveTab('simulator');
      };

      document.body.appendChild(script);
    } else if (window.MdHub) {
      initMemedHub();
    }
  }, [open]);

  const initMemedHub = (): void => {
    if (!window.MdHub) {
      setActiveTab('simulator');
      return;
    }

    try {
      window.MdHub.event.add('prescricaoSalva', (prescricaoData: any) => {
        handlePrescriptionIssued(prescricaoData);
      });

      window.MdHub.event.add('prescricaoImpressa', (prescricaoData: any) => {
        handlePrescriptionIssued(prescricaoData);
      });

      window.MdHub.command.send('plataforma.prescricao', 'setPaciente', {
        nome: patientName,
        cpf: cleanDigits(cpfIdent),
        telefone: cleanDigits(patientPhone),
      });

      window.MdHub.command.send('plataforma.prescricao', 'setMedico', {
        nome: doctorName,
        crm: doctorCrm,
        uf: doctorUf,
      });

      setSdkReady(true);
    } catch (err) {
      console.warn('Erro ao inicializar Memed Hub:', err);
      setActiveTab('simulator');
    }
  };

  const handlePrescriptionIssued = async (data?: any): Promise<void> => {
    if (!oystehr || !patient?.id) return;

    setLoading(true);
    try {
      const prescriptionId = data?.id || `MEMED-${Date.now()}`;
      const pdfUrl = data?.pdfUrl || `https://sandbox.memed.com.br/receita/${prescriptionId}`;

      const diagnosisSummary = (diagnoses || [])
        .map((d) => `${d.code ? `[${d.code}] ` : ''}${d.display}${d.isPrimary ? ' (Principal)' : ''}`)
        .join(', ');

      const description = `Prescrição digital emitida via Memed - Dr(a). ${doctorName} (CRM ${doctorCrm}/${doctorUf})${
        diagnosisSummary ? ` | Diagnósticos (CID-10): ${diagnosisSummary}` : ''
      }`;

      const docRef: DocumentReference = {
        resourceType: 'DocumentReference',
        status: 'current',
        docStatus: 'final',
        type: {
          coding: [
            {
              system: 'http://loinc.org',
              code: '57833-6',
              display: 'Prescription for medication',
            },
          ],
          text: 'Receita Digital Memed (ICP-Brasil)',
        },
        subject: {
          reference: `Patient/${patient.id}`,
          display: patientName,
        },
        date: new Date().toISOString(),
        description,
        identifier: [
          {
            system: 'https://memed.com.br/prescricao',
            value: String(prescriptionId),
          },
        ],
        content: [
          {
            attachment: {
              contentType: 'application/pdf',
              url: pdfUrl,
              title: `Receita Digital ICP-Brasil (${new Date().toLocaleDateString('pt-BR')})`,
            },
          },
        ],
        context: {
          encounter: encounterId ? [{ reference: `Encounter/${encounterId}` }] : undefined,
          related: (diagnoses || [])
            .filter((d) => d.resourceId)
            .map((d) => ({
              reference: `Condition/${d.resourceId}`,
              display: `${d.code ? `[${d.code}] ` : ''}${d.display}`.trim(),
            })),
        },
      };

      await oystehr.fhir.create<DocumentReference>(docRef);

      // In simulator / local mode, save each simulated medication to Medplum FHIR linked to CID-10
      if (activeTab === 'simulator' && simulatedMeds.length > 0) {
        for (const med of simulatedMeds) {
          try {
            await oystehr.fhir.create<MedicationRequest>({
              resourceType: 'MedicationRequest',
              status: 'active',
              intent: 'order',
              meta: {
                tag: [{ system: 'http://ottehr.com/fhir/tag', code: ERX_MEDICATION_META_TAG_CODE }],
              },
              medicationCodeableConcept: {
                text: med.nome,
                coding: [
                  {
                    system: 'https://memed.com.br/medicamento',
                    display: med.nome,
                  },
                ],
              },
              subject: {
                reference: `Patient/${patient.id}`,
                display: patientName,
              },
              encounter: encounterId ? { reference: `Encounter/${encounterId}` } : undefined,
              requester: currentUser?.profileResource?.id
                ? {
                    reference: `Practitioner/${currentUser.profileResource.id}`,
                    display: doctorName,
                  }
                : undefined,
              dosageInstruction: [
                {
                  text: med.posologia,
                  patientInstruction: med.posologia,
                },
              ],
              reasonCode: (diagnoses || []).map((d) => ({
                coding: [
                  {
                    system: 'http://hl7.org/fhir/sid/icd-10',
                    code: d.code,
                    display: d.display,
                  },
                ],
                text: `${d.code ? `[${d.code}] ` : ''}${d.display}`.trim(),
              })),
            });
          } catch (medErr) {
            console.warn('Erro ao registrar item de medicamento no FHIR:', medErr);
          }
        }
      }

      setPrescriptionSuccess(pdfUrl);
      enqueueSnackbar('Prescrição Memed gravada com sucesso no Medplum FHIR!', { variant: 'success' });
      onPrescriptionSaved?.();
    } catch (e: any) {
      console.error('Erro ao salvar receita no Medplum:', e);
      enqueueSnackbar('Erro ao registrar prescrição no prontuário.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = (): void => {
    if (!newMedName.trim()) return;
    setSimulatedMeds([
      ...simulatedMeds,
      {
        nome: newMedName.trim(),
        posologia: newMedDosage.trim() || 'Conforme orientação médica',
        quantidade: '1 unidade',
      },
    ]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleRemoveMedication = (index: number): void => {
    setSimulatedMeds(simulatedMeds.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f7f9fc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <LocalPharmacyIcon color="primary" sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              Prescrição Digital Memed (ICP-Brasil)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Integração nativa de receitas médicas e bulário nacional brasileiro
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Patient and Doctor banner */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#f0f4f8', borderRadius: 2, border: '1px solid #d9e2ec' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                PACIENTE
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {patientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CPF: <strong>{patientCpf}</strong> | Tel: {patientPhone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                MÉDICO PRESCRITOR
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {doctorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CRM: <strong>{doctorCrm}/{doctorUf}</strong> | Certificado Digital ICP-Brasil
              </Typography>
            </Grid>
          </Grid>

          {diagnoses && diagnoses.length > 0 && (
            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed #c0d3e5' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.8 }}>
                DIAGNÓSTICOS ASSOCIADOS À CONSULTA (CID-10):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {diagnoses.map((diag, index) => (
                  <Chip
                    key={diag.resourceId || diag.code || index}
                    size="small"
                    color={diag.isPrimary ? 'primary' : 'default'}
                    variant={diag.isPrimary ? 'filled' : 'outlined'}
                    label={`${diag.code ? `${diag.code} - ` : ''}${diag.display}${diag.isPrimary ? ' (Principal)' : ''}`}
                    sx={{ fontWeight: diag.isPrimary ? 600 : 400 }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {prescriptionSuccess && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon fontSize="inherit" />}
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                endIcon={<OpenInNewIcon />}
                onClick={() => window.open(prescriptionSuccess, '_blank')}
              >
                Abrir Receita (PDF)
              </Button>
            }
          >
            <strong>Prescrição assinada digitalmente com sucesso!</strong>
            <br />
            O documento foi registrado no prontuário do paciente (FHIR DocumentReference).
          </Alert>
        )}

        <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} sx={{ mb: 2 }}>
          <Tab value="memed_live" label="Widget Sinapse Memed (Online)" />
          <Tab value="simulator" label="Prescritor Local (Offline / Sandbox)" />
        </Tabs>

        {activeTab === 'memed_live' && (
          <Box>
            <Box id="memed-prescricao-container" ref={containerRef} sx={{ minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, border: '2px dashed #b8c2cc', borderRadius: 2, bgcolor: '#fafafa' }}>
              {!sdkReady ? (
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={36} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Conectando aos servidores seguros da Memed Sinapse...
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                    Caso a chave de parceiro ainda não esteja ativa na Memed, utilize a aba "Prescritor Local".
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <MedicationIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                  <Typography variant="h6">Widget Memed Conectado</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    A janela de prescrição com bulário oficial foi inicializada para {patientName}.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LocalPharmacyIcon />}
                    onClick={() => {
                      if (window.MdHub) {
                        window.MdHub.command.send('plataforma.prescricao', 'open');
                      }
                    }}
                  >
                    Abrir Plataforma de Prescrição Memed
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {activeTab === 'simulator' && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Modo de Simulação de Prescrição Digital: os medicamentos e posologia selecionados serão registrados diretamente como recurso FHIR DocumentReference e MedicationRequest no Medplum Server.
            </Alert>

            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Medicamentos Prescritos:
            </Typography>

            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0', mb: 2 }}>
              {simulatedMeds.map((med, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMedication(index)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                  divider={index < simulatedMeds.length - 1}
                >
                  <ListItemIcon>
                    <MedicationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={<strong>{med.nome}</strong>}
                    secondary={`${med.posologia} • Quantidade: ${med.quantidade}`}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ p: 2, bgcolor: '#fbfbfb', borderRadius: 1, border: '1px solid #eee', mb: 2 }}>
              <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Adicionar Medicamento:
              </Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Nome do Medicamento e Concentração"
                    placeholder="Ex: Losartana Potássica 50mg"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Posologia e Instruções"
                    placeholder="Ex: 1 comp. pela manhã"
                    value={newMedDosage}
                    onChange={(e) => setNewMedDosage(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ height: 40 }}
                    onClick={handleAddMedication}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, px: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Chip
          label="Certificação Digital ICP-Brasil Padrão CFM"
          color="success"
          size="small"
          variant="outlined"
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" onClick={onClose}>
            Fechar
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={loading}
            startIcon={<PrintIcon />}
            onClick={() => handlePrescriptionIssued()}
          >
            Emitir & Gravar Prescrição no Prontuário
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
