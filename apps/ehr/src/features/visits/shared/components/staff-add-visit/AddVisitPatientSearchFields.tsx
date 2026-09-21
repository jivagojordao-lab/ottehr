import { Grid, InputProps, StandardTextFieldProps, TextField } from '@mui/material';
import { DateTime } from 'luxon';
import { ChangeEvent, FC } from 'react';
import { OnValueChange, PatternFormat } from 'react-number-format';
import DateSearch from 'src/components/DateSearch';

interface FieldProps {
  displayPlaceholder: boolean;
  required: boolean;
  value: string | undefined;
  additionalProps?: StandardTextFieldProps;
  error: boolean;
  errorMessage?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  dataTestId?: string;
}

interface PhoneNumberFieldProps extends FieldProps {
  error: boolean;
  onValueChange?: OnValueChange;
  inputProps?: InputProps;
}

type DateOfBirthFieldProps =
  | (FieldProps & {
      readOnly: true;
    })
  | (FieldProps & {
      readOnly: false;
      birthDate: DateTime | null;
      setBirthDate: (dateTime: DateTime | null) => void;
      setValidDate: (isValid: boolean) => void;
    });

interface AddVisitPatientSearchFieldsProps {
  firstName: FieldProps;
  lastName: FieldProps;
  phoneNumber: PhoneNumberFieldProps;
  dateOfBirth: DateOfBirthFieldProps;
}

export const AddVisitPatientSearchFields: FC<AddVisitPatientSearchFieldsProps> = ({
  firstName,
  lastName,
  phoneNumber,
  dateOfBirth,
}) => {
  const phoneNumberErrorMessage = 'O telefone/celular deve conter DDD e dígitos válidos';

  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          data-testid={lastName.dataTestId}
          fullWidth
          label="Sobrenome"
          placeholder={lastName.displayPlaceholder ? 'Silva' : undefined}
          value={lastName.value}
          error={lastName.error}
          helperText={lastName.error ? 'O sobrenome é obrigatório' : ''}
          onChange={lastName.onChange}
          {...(lastName.additionalProps ?? {})}
          required={lastName.required}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          data-testid={firstName.dataTestId}
          fullWidth
          label="Nome"
          placeholder={firstName.displayPlaceholder ? 'João Carlos' : undefined}
          value={firstName.value}
          error={firstName.error}
          helperText={firstName.error ? 'O nome é obrigatório' : ''}
          onChange={firstName.onChange}
          {...(firstName.additionalProps ?? {})}
          required={firstName.required}
        />
      </Grid>

      <Grid item xs={12}>
        <PatternFormat
          data-testid={phoneNumber.dataTestId}
          customInput={TextField}
          value={phoneNumber.value}
          format="(##) #####-####"
          mask=" "
          label="Celular / Telefone"
          variant="outlined"
          placeholder={phoneNumber.displayPlaceholder ? '(XX) XXXXX-XXXX' : undefined}
          fullWidth
          error={phoneNumber.error}
          helperText={phoneNumber.error ? phoneNumberErrorMessage : ''}
          onValueChange={phoneNumber.onValueChange}
          InputProps={phoneNumber.inputProps}
          required={phoneNumber.required}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        {dateOfBirth.readOnly ? (
          <TextField
            fullWidth
            label="Data de nascimento"
            value={dateOfBirth.value}
            error={dateOfBirth.error}
            helperText={dateOfBirth.error ? dateOfBirth.errorMessage : undefined}
            {...dateOfBirth.additionalProps}
            data-testid={dateOfBirth.dataTestId}
          />
        ) : (
          <DateSearch
            date={dateOfBirth.birthDate}
            setDate={dateOfBirth.setBirthDate}
            defaultValue={null}
            label="Data de nascimento"
            required={dateOfBirth.required}
            setIsValidDate={dateOfBirth.setValidDate}
            error={dateOfBirth.error}
            helperText={dateOfBirth.errorMessage}
          ></DateSearch>
        )}
      </Grid>
    </>
  );
};
