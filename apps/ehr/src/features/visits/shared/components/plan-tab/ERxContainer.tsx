import AddIcon from '@mui/icons-material/Add';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { Practitioner } from 'fhir/r4b';
import { DateTime } from 'luxon';
import { enqueueSnackbar } from 'notistack';
import { FC, useMemo, useState } from 'react';
import { CompleteConfiguration } from 'src/components/CompleteConfiguration';
import { MappedStatusChip } from 'src/components/MappedStatusChip';
import { PageTitle } from 'src/features/visits/shared/components/PageTitle';
import { useGetErxConfigQuery } from 'src/features/visits/telemed/hooks/useGetErxConfig';
import { useApiClients } from 'src/hooks/useAppClients';
import useEvolveUser from 'src/hooks/useEvolveUser';
import { ERX_MEDICATION_META_TAG_CODE } from 'utils/lib/fhir/constants';
import { RoleType } from 'utils/lib/types/api/user.types';
import { formatDateToMDYWithTime } from 'utils/lib/utils/date';
import { RoundedButton } from '../../../../../components/RoundedButton';
import { useChartFields } from '../../hooks/useChartFields';
import { useGetAppointmentAccessibility } from '../../hooks/useGetAppointmentAccessibility';
import { useAppointmentData, useChartData } from '../../stores/appointment/appointment.store';
import { ERX, ERXStatus } from '../ERX';
import { MemedPrescriptionDialog } from '../memed/MemedPrescriptionDialog';
import { PreferredPharmacy } from '../PreferredPharmacy';

const getPractitionerName = (practitioner?: Practitioner): string | undefined => {
  if (!practitioner) {
    return;
  }
  const givenName = practitioner?.name?.[0]?.given?.at(0) ?? '';
  const familyName = practitioner?.name?.[0]?.family ?? '';
  return `${familyName}, ${givenName}`.trim();
};

export const medicationStatusMapper = {
  loading: {
    background: {
      primary: '#B3E5FC',
    },
    color: {
      primary: '#01579B',
    },
  },
  active: {
    background: {
      primary: '#B3E5FC',
    },
    color: {
      primary: '#01579B',
    },
  },
  'on-hold': {
    background: {
      primary: '#D1C4E9',
    },
    color: {
      primary: '#311B92',
    },
  },
  cancelled: {
    background: {
      primary: '#FFFFFF',
    },
    color: {
      primary: '#616161',
    },
  },
  completed: {
    background: {
      primary: '#C8E6C9',
    },
    color: {
      primary: '#1B5E20',
    },
  },
  'entered-in-error': {
    background: {
      primary: '#FFE0B2',
    },
    color: {
      primary: '#E65100',
    },
  },
  stopped: {
    background: {
      primary: '#FFCCBC',
    },
    color: {
      primary: '#BF360C',
    },
  },
  draft: {
    background: {
      primary: '#FFFFFF',
    },
    color: {
      primary: '#616161',
    },
  },
  unknown: {
    background: {
      primary: '#FFFFFF',
    },
    color: {
      primary: '#616161',
    },
  },
};

interface ERxContainerProps {
  showHeader?: boolean;
}

export const ERxContainer: FC<ERxContainerProps> = ({ showHeader = true }) => {
  const { appointment, patient, encounter } = useAppointmentData();
  const { chartData } = useChartData();
  const userTimezone = DateTime.local().zoneName;
  const appointmentStart = useMemo(
    () => formatDateToMDYWithTime(appointment?.start, userTimezone),
    [appointment?.start, userTimezone]
  );
  const { isAppointmentReadOnly: isReadOnly } = useGetAppointmentAccessibility();

  const {
    isLoading,
    isFetching,
    refetch,
    data: chartFields,
  } = useChartFields({
    requestedFields: {
      practitioners: {},
      prescribedMedications: {
        _include: 'MedicationRequest:requester',
        _tag: ERX_MEDICATION_META_TAG_CODE,
      },
      preferredPharmacies: {},
    },
    refetchInterval: 10000,
  });

  const [isMemedOpen, setIsMemedOpen] = useState(false);
  const [isERXOpen, setIsERXOpen] = useState(false);
  const [erxStatus, setERXStatus] = useState(ERXStatus.INITIAL);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [cancellationLoading, setCancellationLoading] = useState<string[]>([]);
  const { oystehr } = useApiClients();
  const user = useEvolveUser();
  const { data: erxConfigData, isLoading: isErxConfigLoading } = useGetErxConfigQuery();

  const cancelPrescription = async (medRequestId: string, patientId: string): Promise<void> => {
    if (!oystehr) {
      enqueueSnackbar('Ocorreu um erro. Tente novamente.', { variant: 'error' });
      return;
    }
    setCancellationLoading((prevState) => [...prevState, medRequestId]);
    try {
      await oystehr.erx.cancelPrescription({ medicationRequestId: medRequestId, patientId });
    } catch (error) {
      enqueueSnackbar('Erro ao cancelar prescrição. Tente novamente.', { variant: 'error' });
      console.error(`Error cancelling prescription: ${error}`);
    } finally {
      await refetch();
      setCancellationLoading((prevState) => prevState.filter((item) => item !== medRequestId));
    }
  };

  const handleCloseTooltip = (): void => {
    setOpenTooltip(false);
  };

  const handleOpenTooltip = (): void => {
    setOpenTooltip(true);
  };

  const onNewOrderClick = async (): Promise<void> => {
    setIsERXOpen(true);
  };

  return (
    <>
      <Stack gap={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
          <Stack direction="row" gap={1} alignItems="center">
            {showHeader && <PageTitle label="Prescrições & Medicamentos (Memed / eRx)" showIntakeNotesButton={false} />}
            {(isLoading || isFetching || cancellationLoading.length > 0) && <CircularProgress size={16} />}
          </Stack>
          <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
            <RoundedButton
              disabled={isReadOnly}
              variant="contained"
              onClick={() => setIsMemedOpen(true)}
              startIcon={<LocalPharmacyIcon />}
              sx={{
                bgcolor: '#2e7d32',
                color: '#fff',
                fontWeight: 700,
                '&:hover': {
                  bgcolor: '#1b5e20',
                },
              }}
            >
              Prescrição Digital Memed (ICP-Brasil)
            </RoundedButton>

            {erxConfigData?.configured && (
              <Tooltip
                placement="top"
                title="Você não possui permissão para acessar o eRx. Contate o administrador."
                open={openTooltip && !isReadOnly && !user?.hasRole([RoleType.Provider])}
                onClose={handleCloseTooltip}
                onOpen={handleOpenTooltip}
              >
                <Stack>
                  {isERXOpen && erxStatus !== ERXStatus.LOADING ? (
                    <RoundedButton
                      disabled={isReadOnly || !user?.hasRole([RoleType.Provider])}
                      variant="outlined"
                      onClick={() => {
                        setIsERXOpen(false);
                      }}
                    >
                      Fechar eRx
                    </RoundedButton>
                  ) : (
                    <RoundedButton
                      disabled={
                        isReadOnly ||
                        erxStatus === ERXStatus.LOADING ||
                        !user?.hasRole([RoleType.Provider])
                      }
                      variant="outlined"
                      onClick={() => onNewOrderClick()}
                      startIcon={erxStatus === ERXStatus.LOADING ? <CircularProgress size={16} /> : <AddIcon />}
                    >
                      {erxStatus === ERXStatus.LOADING ? 'Carregando eRx' : 'Abrir eRx'}
                    </RoundedButton>
                  )}
                </Stack>
              </Tooltip>
            )}
          </Stack>
        </Stack>

        {chartFields?.preferredPharmacies && <PreferredPharmacy data={chartFields?.preferredPharmacies} />}

        {!erxConfigData?.configured && !isErxConfigLoading && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 1.5,
              bgcolor: '#f1f8e9',
              border: '1px solid #c5e1a5',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="#2e7d32">
                Prescrição Eletrônica Integrada Memed (Padrão CFM & ICP-Brasil)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Emita receitas médicas digitais com bulário Anvisa atualizado, pedidos de exames e atestados com assinatura digital ICP-Brasil válida em farmácias de todo o Brasil.
              </Typography>
            </Box>
            <RoundedButton
              variant="contained"
              size="small"
              startIcon={<LocalPharmacyIcon />}
              onClick={() => setIsMemedOpen(true)}
              sx={{ bgcolor: '#2e7d32', color: '#fff', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              Nova Receita Memed
            </RoundedButton>
          </Paper>
        )}

        {isERXOpen && (
          <ERX
            onStatusChanged={(status) => {
              if (status === ERXStatus.ERROR) {
                setIsERXOpen(false);
              }
              setERXStatus(status);
            }}
            showDefaultAlert={true}
          />
        )}
        <div id="prescribe-dialog" style={{ flex: '1 0 auto', display: 'flex' }} />

        {chartFields?.prescribedMedications && chartFields.prescribedMedications.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{
                  '& .MuiTableCell-head': {
                    fontWeight: 700,
                  },
                }}
              >
                <TableRow>
                  <TableCell>Medicamento</TableCell>
                  <TableCell>Posologia / Instruções</TableCell>
                  {/*<TableCell>Dx</TableCell>*/}
                  <TableCell>Consulta</TableCell>
                  <TableCell>Profissional</TableCell>
                  <TableCell>Data / Hora</TableCell>
                  {/*<TableCell>Pharmacy</TableCell>*/}
                  <TableCell>Status</TableCell>
                  {!isReadOnly && <TableCell>Ações</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {chartFields.prescribedMedications.map((row) => {
                  const rowAdded = formatDateToMDYWithTime(row?.added, userTimezone);
                  return (
                    <TableRow key={row.resourceId}>
                      <TableCell>
                        <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                          <Typography variant="body2">{row.name}</Typography>
                          {row.isRenewal && <Chip label="Renovação" size="small" color="primary" variant="outlined" />}
                        </Stack>
                      </TableCell>
                      <TableCell>{row.instructions}</TableCell>
                      {/*<TableCell>Dx</TableCell>*/}
                      <TableCell>
                        {appointmentStart && (
                          <>
                            <Typography variant="body2">{appointmentStart.date}</Typography>
                            <Typography variant="body2">{appointmentStart.time}</Typography>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {getPractitionerName(
                          chartFields.practitioners?.find((practitioner) => practitioner.id === row.provider)
                        )}
                      </TableCell>
                      <TableCell>
                        {rowAdded && (
                          <>
                            <Typography variant="body2">{rowAdded.date}</Typography>
                            <Typography variant="body2">{rowAdded.time}</Typography>
                          </>
                        )}
                      </TableCell>
                      {/*<TableCell>Pharmacy</TableCell>*/}
                      <TableCell>
                        {!!row.status && <MappedStatusChip status={row.status} mapper={medicationStatusMapper} />}
                      </TableCell>
                      {!isReadOnly && patient?.id && (
                        <TableCell>
                          <LoadingButton
                            loading={cancellationLoading.includes(row.resourceId!)}
                            variant="text"
                            color="error"
                            onClick={() => cancelPrescription(row.resourceId!, patient.id!)}
                            disabled={
                              row.status === 'loading' ||
                              row.status === 'completed' ||
                              row.status === 'cancelled' ||
                              cancellationLoading.includes(row.resourceId!)
                            }
                          >
                            Cancelar
                          </LoadingButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>

      <MemedPrescriptionDialog
        open={isMemedOpen}
        onClose={() => setIsMemedOpen(false)}
        patient={patient}
        encounterId={encounter?.id || appointment?.id}
        diagnoses={chartData?.diagnosis}
        onPrescriptionSaved={async () => {
          await refetch();
        }}
      />
    </>
  );
};
