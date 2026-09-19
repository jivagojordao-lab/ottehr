import CloseIcon from '@mui/icons-material/Close';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Patient } from 'fhir/r4b';
import { enqueueSnackbar } from 'notistack';
import { FC, useState } from 'react';
import { useApiClients } from 'src/hooks/useAppClients';
import {
  cleanDigits,
  fetchAddressByCEP,
  formatCEP,
  formatCPF,
  formatPhoneBR,
  validateCPF,
} from 'utils/lib/helpers/brazilValidation';

interface CreatePatientDialogProps {
  open: boolean;
  onClose: () => void;
  onPatientCreated?: (patient: Patient) => void;
}

export const CreatePatientDialog: FC<CreatePatientDialogProps> = ({ open, onClose, onPatientCreated }) => {
  const { oystehr } = useApiClients();

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [cpf, setCpf] = useState('');
  const [cns, setCns] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'unknown'>('unknown');

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cpfError, setCpfError] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleCpfChange = (val: string): void => {
    const formatted = formatCPF(val);
    setCpf(formatted);
    const digits = cleanDigits(formatted);
    if (digits.length === 11) {
      if (!validateCPF(digits)) {
        setCpfError('CPF inválido. Verifique os dígitos digitados.');
      } else {
        setCpfError('');
      }
    } else if (digits.length > 0) {
      setCpfError('O CPF deve conter 11 dígitos.');
    } else {
      setCpfError('');
    }
  };

  const handleCepChange = async (val: string): Promise<void> => {
    const formatted = formatCEP(val);
    setCep(formatted);
    const digits = cleanDigits(formatted);

    if (digits.length === 8) {
      setLoadingCep(true);
      try {
        const addr = await fetchAddressByCEP(digits);
        if (addr) {
          setStreet(addr.street);
          setNeighborhood(addr.neighborhood);
          setCity(addr.city);
          setState(addr.state);
        }
      } catch (e) {
        console.error('Erro na busca de CEP:', e);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitError('');

    if (!oystehr) {
      setSubmitError('Servidor clínico Medplum não disponível.');
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setSubmitError('Nome e sobrenome são obrigatórios.');
      return;
    }

    const cleanCpf = cleanDigits(cpf);
    if (!cleanCpf || !validateCPF(cleanCpf)) {
      setCpfError('Informe um CPF válido para continuar.');
      setSubmitError('CPF do paciente é inválido.');
      return;
    }

    if (!dateOfBirth) {
      setSubmitError('Data de nascimento é obrigatória.');
      return;
    }

    const cleanPhone = cleanDigits(phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      setSubmitError('Informe um telefone de contato válido com DDD.');
      return;
    }

    setLoading(true);

    try {
      const patientResource: Patient = {
        resourceType: 'Patient',
        active: true,
        name: [
          {
            use: 'official',
            family: lastName.trim(),
            given: [firstName.trim()],
            text: `${firstName.trim()} ${lastName.trim()}`,
          },
          ...(preferredName.trim() ? [{ use: 'nickname' as const, given: [preferredName.trim()] }] : []),
        ],
        birthDate: dateOfBirth,
        gender: gender,
        telecom: [
          { system: 'phone', value: `+55${cleanPhone}`, use: 'mobile', rank: 1 },
          ...(email.trim() ? [{ system: 'email' as const, value: email.trim() }] : []),
        ],
        identifier: [
          {
            system: 'https://saude.gov.br/fhir/sid/cpf',
            value: cleanCpf,
          },
          ...(cleanDigits(cns)
            ? [
                {
                  system: 'https://saude.gov.br/fhir/sid/cns',
                  value: cleanDigits(cns),
                },
              ]
            : []),
        ],
        address: [
          {
            use: 'home',
            line: [street.trim(), number.trim(), complement.trim()].filter(Boolean),
            district: neighborhood.trim(),
            city: city.trim(),
            state: state.trim().toUpperCase(),
            postalCode: cleanDigits(cep),
            country: 'BRA',
          },
        ],
      };

      const createdPatient = await oystehr.fhir.create<Patient>(patientResource);

      enqueueSnackbar(`Paciente ${firstName} cadastrado com sucesso!`, { variant: 'success' });

      if (onPatientCreated) {
        onPatientCreated(createdPatient);
      }

      handleClose();
    } catch (err: any) {
      console.error('Falha ao cadastrar paciente:', err);
      const msg = err?.message || 'Erro ao persistir paciente no servidor Medplum.';
      setSubmitError(msg);
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    setFirstName('');
    setLastName('');
    setPreferredName('');
    setCpf('');
    setCns('');
    setDateOfBirth('');
    setGender('unknown');
    setPhone('');
    setEmail('');
    setCep('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setCpfError('');
    setSubmitError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <PersonAddAlt1Icon color="primary" />
          <Typography variant="h6" component="div" fontWeight={600}>
            Cadastrar Novo Paciente
          </Typography>
        </Box>
        <IconButton aria-label="close" onClick={handleClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ p: 3 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Typography variant="subtitle2" color="primary.main" fontWeight={700} sx={{ mb: 1.5 }}>
            1. Dados Pessoais & Identificação Nacional
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Primeiro Nome"
                placeholder="Ex: Carlos"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Sobrenome"
                placeholder="Ex: Eduardo da Silva"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Nome Social / Apelido"
                placeholder="Ex: Edu"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="CPF"
                placeholder="000.000.000-00"
                value={cpf}
                error={Boolean(cpfError)}
                helperText={cpfError || 'Validação oficial (módulo 11)'}
                onChange={(e) => handleCpfChange(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                type="date"
                label="Data de Nascimento"
                InputLabelProps={{ shrink: true }}
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Sexo Biológico"
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <MenuItem value="male">Masculino</MenuItem>
                <MenuItem value="female">Feminino</MenuItem>
                <MenuItem value="other">Outro / Intersexo</MenuItem>
                <MenuItem value="unknown">Não informado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cartão SUS (CNS)"
                placeholder="000 0000 0000 0000"
                value={cns}
                helperText="Opcional (15 dígitos)"
                onChange={(e) => setCns(cleanDigits(e.target.value).slice(0, 15))}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" color="primary.main" fontWeight={700} sx={{ mb: 1.5 }}>
            2. Contato & Notificações
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Telefone / WhatsApp Celular"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
                label="E-mail"
                placeholder="paciente@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" color="primary.main" fontWeight={700} sx={{ mb: 1.5 }}>
            3. Endereço Residencial (BrasilAPI / ViaCEP)
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CEP"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => handleCepChange(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingCep ? <CircularProgress size={20} /> : <SearchIcon color="action" />}
                    </InputAdornment>
                  ),
                }}
                helperText="Preenchimento automático ao digitar 8 dígitos"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Logradouro (Rua, Av.)"
                placeholder="Ex: Av. Paulista"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Número"
                placeholder="Ex: 1000"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Complemento"
                placeholder="Ex: Apto 42, Bloco B"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Bairro"
                placeholder="Ex: Bela Vista"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Cidade"
                placeholder="Ex: São Paulo"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Estado (UF)"
                placeholder="SP"
                inputProps={{ maxLength: 2 }}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, px: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary">
            * Campos obrigatórios para conformidade FHIR R4 e RNDS.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <LoadingButton variant="outlined" onClick={handleClose} disabled={loading}>
              Cancelar
            </LoadingButton>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={loading}
              startIcon={<PersonAddAlt1Icon />}
            >
              Salvar Paciente
            </LoadingButton>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
