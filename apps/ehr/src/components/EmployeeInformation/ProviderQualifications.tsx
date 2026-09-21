import { otherColors } from '@ehrTheme/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Card,
  FormControl,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { Control, Controller } from 'react-hook-form';
import { PractitionerLicense, PractitionerQualificationCodesLabels } from 'utils/lib/types/api/practitioner.types';
import { AllStates } from 'utils/lib/types/common';
import { dataTestIds } from '../../constants/data-test-ids';
import { RoundedButton } from '../RoundedButton';
import { FormErrors } from './types';

const displayStates = AllStates.map((state) => state.value);

interface ProviderQualificationsProps {
  control: Control<any>;
  errors: FormErrors;
  handleAddLicense: () => void;
  newLicenses: PractitionerLicense[];
  setNewLicenses: (licenses: PractitionerLicense[]) => void;
}

export function ProviderQualifications({
  control,
  errors,
  handleAddLicense,
  newLicenses,
  setNewLicenses,
}: ProviderQualificationsProps): JSX.Element {
  return (
    <FormControl sx={{ width: '100%' }}>
      <Stack mt={1} gap={2}>
        {newLicenses.length > 0 && (
          <TableContainer>
            <Table data-testid={dataTestIds.employeesPage.qualificationsTable}>
              <TableHead>
                <TableRow>
                  <TableCell>Estado</TableCell>
                  <TableCell align="left">Qualificação</TableCell>
                  <TableCell align="left">Licença / Registro</TableCell>
                  <TableCell align="left">Atuar no estado</TableCell>
                  <TableCell align="left">Excluir Licença</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newLicenses.map((license, index) => (
                  <TableRow key={index} data-testid={dataTestIds.employeesPage.qualificationRow(license.code)}>
                    <TableCell>{license.state}</TableCell>
                    <TableCell align="left">{license.code}</TableCell>
                    <TableCell align="left">
                      {license.number && <Typography>{license.number}</Typography>}
                      {license.date && (
                        <Typography variant="body2" color="secondary.light">
                          até {DateTime.fromISO(license.date).toFormat('dd/MM/yyyy')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={license.active}
                        onChange={async () => {
                          const updatedLicenses = [...newLicenses];
                          updatedLicenses[index].active = !updatedLicenses[index].active;
                          setNewLicenses(updatedLicenses);
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{
                          color: 'error.dark',
                          ':hover': {
                            backgroundColor: 'error.light',
                            color: 'error.contrastText',
                          },
                        }}
                        onClick={async () => {
                          const updatedLicenses = [...newLicenses];
                          updatedLicenses.splice(index, 1);
                          setNewLicenses(updatedLicenses);
                        }}
                        data-testid={dataTestIds.employeesPage.deleteQualificationButton}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Card
          sx={{ p: 2, backgroundColor: otherColors.formCardBg }}
          elevation={0}
          component={Stack}
          spacing={2}
          data-testid={dataTestIds.employeesPage.addQualificationCard}
        >
          <Typography fontWeight={600} color="primary.dark">
            Adicionar qualificação estadual
          </Typography>

          <Stack direction="row" spacing={2}>
            <Controller
              name="newLicenseState"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  fullWidth
                  size="small"
                  options={displayStates}
                  getOptionLabel={(option: string) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Estado"
                      data-testid={dataTestIds.employeesPage.newQualificationStateDropdown}
                      error={errors.state}
                      helperText={errors.state ? 'Selecione um estado' : null}
                    />
                  )}
                  onChange={(_, value: string | null) => field.onChange(value ?? undefined)}
                  value={field.value || null}
                />
              )}
            />

            <Controller
              name="newLicenseCode"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  fullWidth
                  size="small"
                  options={Object.keys(PractitionerQualificationCodesLabels)}
                  getOptionLabel={(option: string) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Qualificação"
                      data-testid={dataTestIds.employeesPage.newQualificationTypeDropdown}
                      error={errors.qualification}
                      helperText={errors.qualification ? 'Selecione uma qualificação' : null}
                    />
                  )}
                  onChange={(_, value: string | null) => field.onChange(value ?? undefined)}
                  value={field.value || null}
                />
              )}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Controller
              name="newLicenseNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  size="small"
                  label="Número da licença"
                  data-testid={dataTestIds.employeesPage.newQualificationNumberField}
                  error={errors.number}
                  helperText={errors.number ? 'Informe o número da licença' : null}
                  onChange={(e) => field.onChange(e.target.value ?? undefined)}
                  value={field.value || ''}
                />
              )}
            />

            <Controller
              name="newLicenseExpirationDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DatePicker
                    label="Data de validade"
                    onChange={onChange}
                    slotProps={{
                      textField: {
                        style: { width: '100%' },
                        size: 'small',
                        helperText: errors.date ? 'Informe a data de validade' : null,
                        error: errors.date,
                        inputProps: {
                          'data-testid': dataTestIds.employeesPage.newQualificationExpDatePicker,
                        },
                      },
                    }}
                    value={value || null}
                  />
                </LocalizationProvider>
              )}
            />
          </Stack>

          <RoundedButton data-testid={dataTestIds.employeesPage.addQualificationButton} onClick={handleAddLicense}>
            Adicionar
          </RoundedButton>

          {errors.duplicateLicense && (
            <Typography color="error" variant="body2" mt={1} mx={1}>{`Licença já cadastrada.`}</Typography>
          )}
        </Card>
      </Stack>
    </FormControl>
  );
}
