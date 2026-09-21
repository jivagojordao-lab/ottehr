import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { ReactElement, useEffect } from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import useEvolveUser from 'src/hooks/useEvolveUser';
import { useProgressNoteConfig, useUpdateProgressNoteConfig } from 'src/hooks/useProgressNoteConfig';
import { mapDispositionTypeToLabel } from 'utils/lib/fhir/disposition';
import {
  ProgressNoteConfig,
  UpdateProgressNoteConfigInputSchema,
  VITALS_UNIT_INPUT_ORDER_LABELS,
  VITALS_UNIT_INPUT_ORDERS,
} from 'utils/lib/types/api/progress-note-config/progress-note-config.types';
import { RoleType } from 'utils/lib/types/api/user.types';
import { DEFAULT_PROGRESS_NOTE_CONFIG } from 'utils/lib/utils/progress-note-config';

type ProgressNoteTextFieldName = Exclude<keyof ProgressNoteConfig, 'mdmRequired' | 'vitalsUnitInputOrder'>;

interface ConfigTextAreaFieldProps {
  control: Control<ProgressNoteConfig>;
  name: ProgressNoteTextFieldName;
  label: string;
  minRows?: number;
}

const ConfigTextAreaField = ({ control, name, label, minRows = 2 }: ConfigTextAreaFieldProps): ReactElement => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        label={label}
        multiline
        minRows={minRows}
        fullWidth
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
      />
    )}
  />
);

export default function ProgressNoteAdminPage(): ReactElement {
  const { data, isPending, isError } = useProgressNoteConfig();
  const { mutate, isPending: isSubmitting } = useUpdateProgressNoteConfig();
  const isCustomerSupport = useEvolveUser()?.hasRole([RoleType.CustomerSupport]) ?? false;

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    reset,
  } = useForm<ProgressNoteConfig>({
    defaultValues: DEFAULT_PROGRESS_NOTE_CONFIG,
    resolver: zodResolver(UpdateProgressNoteConfigInputSchema),
  });

  useEffect(() => {
    if (!data) return;
    reset(
      {
        ...DEFAULT_PROGRESS_NOTE_CONFIG,
        ...data,
      },
      { keepDirtyValues: true }
    );
  }, [data, reset]);

  const onSubmit = (values: ProgressNoteConfig): void => {
    // The prompt field is customer-support-only, and react-hook-form submits the value it loaded
    // even for a field it never rendered. Omitting it keeps this form from carrying a stale prompt
    // back to the server, where absent means "leave the stored prompt alone".
    const { signReviewPrompt: _signReviewPrompt, ...withoutPrompt } = values;
    const payload = isCustomerSupport ? values : withoutPrompt;

    mutate(payload, {
      onSuccess: () => {
        reset(values);
      },
    });
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configurações de como os profissionais preenchem e assinam as notas de evolução
      </Typography>

      {isPending ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={3}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">Falha ao carregar as configurações atuais da nota de evolução.</Alert>
      ) : (
        <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                Avaliação
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Conteúdo padrão utilizado quando a Tomada de Decisão Médica (TDM) é pré-preenchida para uma nova nota.
              </Typography>
              <ConfigTextAreaField
                control={control}
                name="medicalDecisionDefaultText"
                label="Conteúdo padrão da Tomada de Decisão Médica (TDM)"
                minRows={4}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                Desfecho / Encaminhamento
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Conteúdo padrão exibido quando uma opção de desfecho é selecionada
              </Typography>
              <Stack spacing={2}>
                <ConfigTextAreaField
                  control={control}
                  name="pcpNoTypeDispositionDefaultText"
                  label={mapDispositionTypeToLabel['pcp-no-type']}
                />
                <ConfigTextAreaField
                  control={control}
                  name="anotherDispositionDefaultText"
                  label={mapDispositionTypeToLabel.another}
                />
                <ConfigTextAreaField
                  control={control}
                  name="edDispositionDefaultText"
                  label={mapDispositionTypeToLabel.ed}
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Controller
                name="mdmRequired"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControlLabel
                    control={<Switch checked={value} onChange={(_event, checked) => onChange(checked)} />}
                    label="TDM obrigatória para assinar e fechar"
                  />
                )}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                Sinais Vitais
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Ordem dos campos de unidade de medida quando um sinal vital é inserido (ex.: peso, altura, temperatura)
              </Typography>
              <Controller
                name="vitalsUnitInputOrder"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl fullWidth>
                    <InputLabel id="vitals-unit-input-order-label">Ordem das unidades de medida dos sinais vitais</InputLabel>
                    <Select
                      labelId="vitals-unit-input-order-label"
                      label="Ordem das unidades de medida dos sinais vitais"
                      value={value}
                      onChange={(event) => onChange(event.target.value)}
                    >
                      {VITALS_UNIT_INPUT_ORDERS.map((order) => (
                        <MenuItem key={order} value={order}>
                          {VITALS_UNIT_INPUT_ORDER_LABELS[order]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {/* Field is hidden for non-CustomerSupport users, but its value still round-trips unchanged:
                react-hook-form submits values carried in defaultValues/reset even when the field is never rendered. */}
            {isCustomerSupport && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    Revisão da nota ao assinar
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Requisitos verificados na nota quando um profissional abre Revisar e Assinar. Qualquer pendência é
                    exibida ao profissional como aviso informativo — nunca bloqueia a assinatura. Deixe em branco para desativar.
                  </Typography>
                  <ConfigTextAreaField
                    control={control}
                    name="signReviewPrompt"
                    label="Requisitos de revisão da nota"
                    minRows={4}
                  />
                </Box>
              </>
            )}

            <Divider />

            <Stack direction="row" spacing={1}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isDirty}>
                Salvar
              </LoadingButton>
              <LoadingButton
                type="button"
                variant="outlined"
                disabled={isSubmitting || !isDirty}
                onClick={() => reset({ ...DEFAULT_PROGRESS_NOTE_CONFIG, ...data })}
              >
                Descartar alterações
              </LoadingButton>
            </Stack>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
