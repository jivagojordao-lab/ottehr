import { Autocomplete, Box, Grid, TextField, Typography, useTheme } from '@mui/material';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTime } from 'luxon';
import { Controller } from 'react-hook-form';
import { InputMask } from 'ui-components/lib/components/InputMask';
import { AllStates } from 'utils/lib/types/common';
import { phoneRegex, zipRegex } from 'utils/lib/validation/regex';
import { dataTestIds } from '../../constants/data-test-ids';
import { BasicInformationProps } from './types';

const displayStates = AllStates.map((state) => state.value);

export function BasicInformation({ control, existingUser, isActive }: BasicInformationProps): JSX.Element {
  const theme = useTheme();
  const fieldsDisabled = isActive === false;
  return (
    <Box>
      <Typography sx={{ ...theme.typography.h4, color: theme.palette.primary.dark, mb: 2 }}>
        Informações do colaborador
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="firstName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Nome"
                required
                disabled={fieldsDisabled}
                data-testid={dataTestIds.employeesPage.firstName}
                value={value || ''}
                onChange={onChange}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="middleName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Nome do meio"
                data-testid={dataTestIds.employeesPage.middleName}
                value={value || ''}
                disabled={fieldsDisabled}
                onChange={onChange}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="lastName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Sobrenome"
                data-testid={dataTestIds.employeesPage.lastName}
                required
                disabled={fieldsDisabled}
                value={value || ''}
                onChange={onChange}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="E-mail"
            data-testid={dataTestIds.employeesPage.email}
            value={existingUser?.email ?? ''}
            sx={{ width: '100%' }}
            margin="dense"
            disabled={fieldsDisabled}
            InputProps={{
              readOnly: true,
              disabled: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              pattern: {
                value: phoneRegex,
                message: 'Telefone deve ter 10 dígitos no formato (xxx) xxx-xxxx',
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Telefone"
                data-testid={dataTestIds.employeesPage.phone}
                value={value || ''}
                disabled={fieldsDisabled}
                onChange={onChange}
                error={error?.message !== undefined}
                inputProps={{ mask: '(000) 000-0000' }}
                InputProps={{
                  inputComponent: InputMask as any,
                }}
                helperText={error?.message ?? ''}
                FormHelperTextProps={{
                  sx: { ml: 0, mt: 1 },
                }}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="faxNumber"
            control={control}
            rules={{
              pattern: {
                value: phoneRegex,
                message: 'Fax deve ter 10 dígitos no formato (xxx) xxx-xxxx',
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Fax"
                data-testid={dataTestIds.employeesPage.fax}
                value={value || ''}
                onChange={onChange}
                disabled={fieldsDisabled}
                error={error?.message !== undefined}
                sx={{ width: '100%' }}
                inputProps={{ mask: '(000) 000-0000' }}
                InputProps={{
                  inputComponent: InputMask as any,
                }}
                helperText={error?.message ?? ''}
                FormHelperTextProps={{
                  sx: { ml: 0, mt: 1 },
                }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="birthDate"
            control={control}
            rules={{
              validate: (value) => {
                if (value) {
                  const date = DateTime.fromISO(value);
                  if (!date.isValid) {
                    return 'Informe uma data de nascimento válida';
                  }
                  if (date > DateTime.now()) {
                    return 'Data de nascimento não pode estar no futuro';
                  }
                }
                return true;
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DatePicker
                  label="Data de nascimento"
                  onChange={onChange}
                  disabled={fieldsDisabled}
                  slotProps={{
                    textField: {
                      style: { width: '100%' },
                      margin: 'dense',
                      helperText: error?.message ? error?.message : null,
                      error: error?.message !== undefined,
                      inputProps: {
                        'data-testid': dataTestIds.employeesPage.birthDate,
                      },
                    },
                  }}
                  value={value || null}
                />
              </LocalizationProvider>
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="addressLine1"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Endereço"
                data-testid={dataTestIds.employeesPage.addressLine1}
                value={value || ''}
                disabled={fieldsDisabled}
                onChange={onChange}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="addressLine2"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Complemento"
                data-testid={dataTestIds.employeesPage.addressLine2}
                value={value || ''}
                onChange={onChange}
                disabled={fieldsDisabled}
                error={error?.message !== undefined}
                helperText={error?.message ?? ''}
                FormHelperTextProps={{
                  sx: { ml: 0, mt: 1 },
                }}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Controller
            name="addressCity"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                label="Cidade"
                data-testid={dataTestIds.employeesPage.addressCity}
                value={value || ''}
                disabled={fieldsDisabled}
                onChange={onChange}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="addressState"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={displayStates}
                value={value || null}
                disabled={fieldsDisabled}
                onChange={(_event, newValue) => onChange(newValue ?? '')}
                isOptionEqualToValue={(option, selected) => option === selected}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estado"
                    margin="dense"
                    inputProps={{
                      ...params.inputProps,
                      'data-testid': dataTestIds.employeesPage.addressState,
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="addressZip"
            control={control}
            rules={{
              pattern: {
                value: zipRegex,
                message: 'CEP deve conter dígitos válidos',
              },
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="CEP"
                data-testid={dataTestIds.employeesPage.addressZip}
                error={error?.message !== undefined}
                value={value || ''}
                onChange={onChange}
                disabled={fieldsDisabled}
                helperText={error?.message ?? ''}
                FormHelperTextProps={{
                  sx: { ml: 0, mt: 1 },
                }}
                inputProps={{ mask: '00000' }}
                InputProps={{
                  inputComponent: InputMask as any,
                }}
                sx={{ width: '100%' }}
                margin="dense"
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
