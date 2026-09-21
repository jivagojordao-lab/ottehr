import { LoadingButton } from '@mui/lab';
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { Patient, Person, RelatedPerson } from 'fhir/r4b';
import { DateTime } from 'luxon';
import { enqueueSnackbar } from 'notistack';
import { FC, MouseEvent, useCallback, useState } from 'react';
import { dataTestIds } from 'src/constants/data-test-ids';
import { useApiClients } from 'src/hooks/useAppClients';
import { AddVisitErrorState, AddVisitFormState, AddVisitPatientInfo } from 'src/pages/AddPatient';
import { getFirstName, getLastName, getMiddleName } from 'utils/lib/fhir/patient';
import { getPhoneNumberDigits } from 'utils/lib/helpers/helpers';
import { PersonSex } from 'utils/lib/types/common';
import { AddVisitPatientSearchDialog } from './AddVisitPatientSearchDialog';
import { AddVisitPatientSearchFields } from './AddVisitPatientSearchFields';

const GENDER_LABELS_BR: Record<string, string> = {
  male: 'Masculino',
  female: 'Feminino',
  other: 'Outro / Intersexo',
  unknown: 'Desconhecido',
};

const defaultSearchFilters = { givenNames: '', lastName: '', phone: '', dateOfBirth: '' };
const readOnlyTextFieldProps: TextFieldProps = {
  InputProps: {
    readOnly: true,
    sx: {
      pointerEvents: 'none',
    },
  },
};
interface AddVisitPatientInformationCardProps {
  patientInfo: AddVisitPatientInfo | undefined;
  setPatientInfo: (info: AddVisitPatientInfo | undefined) => void;
  showFields: AddVisitFormState;
  setShowFields: (formState: AddVisitFormState) => void;
  setValidDate: (isValid: boolean) => void;
  errors: AddVisitErrorState;
  setErrors: (errorState: AddVisitErrorState) => void;
  birthDate: DateTime | null;
  setBirthDate: (dateTime: DateTime | null) => void;
}
export const AddVisitPatientInformationCard: FC<AddVisitPatientInformationCardProps> = ({
  patientInfo,
  setPatientInfo,
  showFields,
  setShowFields,
  setValidDate,
  errors,
  setErrors,
  birthDate,
  setBirthDate,
}) => {
  const { oystehr } = useApiClients();

  const [openSearchResults, setOpenSearchResults] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<AddVisitPatientInfo | undefined>(undefined);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchFilters, setSearchFilters] = useState(defaultSearchFilters);
  const [patients, setPatients] = useState<AddVisitPatientInfo[]>([]);

  // consts
  const formattedDOB = patientInfo?.dateOfBirth
    ? DateTime.fromISO(patientInfo.dateOfBirth).setLocale('pt-BR').toFormat('dd/MM/yyyy')
    : '';

  // helpers
  const setSearchField = useCallback(
    ({ field, value }: { field: keyof typeof defaultSearchFilters; value: string }): void => {
      setSearchFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [setSearchFilters]
  );
  const resetFilters = (): void => setSearchFilters(defaultSearchFilters);

  const resetSearchErrorsAndCloseSearchDialog = (): void => {
    setOpenSearchResults(false);
    setErrors({ ...errors, search: false, searchEntry: false });
  };

  const searchResources = async (): Promise<void> => {
    if (!oystehr) {
      throw new Error('oystehr client not available');
    }
    const params = [
      {
        name: 'active',
        value: 'true',
      },
      {
        name: '_revinclude:iterate',
        value: 'RelatedPerson:patient',
      },
      {
        name: '_revinclude:iterate',
        value: 'Person:link', // user resource
      },
      {
        name: '_sort',
        value: 'family,name',
      },
    ];
    if (searchFilters.lastName) {
      params.push({
        name: 'family',
        value: searchFilters.lastName,
      });
    }
    if (searchFilters.givenNames) {
      params.push({
        name: 'name',
        value: searchFilters.givenNames,
      });
    }
    if (searchFilters.phone) {
      params.push({
        // the number really represents the users number
        name: '_has:RelatedPerson:patient:_has:Person:link:telecom',
        value: `+1${searchFilters.phone}`,
      });
    } else {
      params.push({
        // do not return patients without users
        name: '_has:RelatedPerson:patient:_has:Person:link:_id:missing',
        value: 'false',
      });
    }
    if (searchFilters.dateOfBirth) {
      params.push({
        name: 'birthdate',
        value: searchFilters.dateOfBirth,
      });
    }
    const resources = (
      await oystehr.fhir.search<Patient | Person | RelatedPerson>({
        resourceType: 'Patient',
        params,
      })
    ).unbundle();
    const parsedPatients: AddVisitPatientInfo[] = [];
    // todo this can probably be done better / quicker with reduce
    resources.forEach((resource) => {
      if (resource.resourceType !== 'Patient') return;
      const fhirPatient = resource;
      const relatedPerson = resources.find(
        (resource) =>
          resource.resourceType === 'RelatedPerson' &&
          resource.patient.reference === `Patient/${fhirPatient.id}` &&
          resource.relationship?.some((rel) => rel.coding?.some((c) => c.code === 'user-relatedperson'))
      );
      if (!relatedPerson) return;

      const user = resources.find(
        (resource) =>
          resource.resourceType === 'Person' &&
          resource.link?.some((link) => link.target.reference === `RelatedPerson/${relatedPerson.id}`)
      );
      if (!user) return;

      const formattedPatientInfo: AddVisitPatientInfo = {
        id: fhirPatient.id,
        newPatient: false,
        firstName: getFirstName(fhirPatient),
        middleName: getMiddleName(fhirPatient),
        lastName: getLastName(fhirPatient),
        dateOfBirth: fhirPatient.birthDate,
        sex: fhirPatient.gender,
        phoneNumber: getPhoneNumberDigits(user.telecom?.find((telecom) => telecom.system === 'phone')?.value),
      };
      parsedPatients.push(formattedPatientInfo);
    });

    setPatients(parsedPatients);
    setOpenSearchResults(true);
  };

  // handlers
  const handlePatientSearch = async (): Promise<void> => {
    if (!searchFilters.phone && !searchFilters.givenNames && !searchFilters.lastName && !searchFilters.dateOfBirth) {
      setErrors({ searchEntry: true });
      return;
    } else {
      setErrors({ ...errors, searchEntry: false });
    }
    if (searchFilters.phone && searchFilters.phone.length !== 10) {
      setErrors({ phone: true });
      return;
    } else {
      setErrors({ ...errors, phone: false });
    }
    setSelectedPatient(undefined);
    try {
      setSearching(true);
      await searchResources();
    } catch (e) {
      console.log('error search resources: ', e);
      console.log(JSON.stringify(e));
      enqueueSnackbar('Error searching for patient', { variant: 'error' });
    }
    setSearching(false);
  };

  const handlePatientSearchClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    void handlePatientSearch();
  };

  const handleManuallyEnterPatientDetails = (): void => {
    setPatientInfo({
      newPatient: true,
      phoneNumber: searchFilters?.phone,
      firstName: searchFilters?.givenNames,
      lastName: searchFilters?.lastName,
    });
    setShowFields('manuallyEnterPatientDetails');
    resetSearchErrorsAndCloseSearchDialog();
    resetFilters();
  };

  const handleSelectExistingPatient = (): void => {
    if (selectedPatient) {
      setPatientInfo({
        id: selectedPatient.id,
        newPatient: false,
        dateOfBirth: selectedPatient?.dateOfBirth,
        phoneNumber: getPhoneNumberDigits(selectedPatient?.phoneNumber),
        firstName: selectedPatient?.firstName,
        lastName: selectedPatient?.lastName,
        sex: selectedPatient?.sex as PersonSex,
      });
      setShowFields('existingPatientSelected');
      resetSearchErrorsAndCloseSearchDialog();
    } else {
      enqueueSnackbar('Please select a patient or "Other patient / Add manually', { variant: 'error' });
    }
    resetFilters();
  };

  const handleResetSearch = (): void => {
    resetFilters();
    setSelectedPatient(undefined);
    setBirthDate(null);
    setShowFields('displayPatientSearch');
    setPatientInfo(undefined);
  };

  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid item>
          <Typography variant="h4" color="primary.dark">
            Informações do Paciente
          </Typography>
        </Grid>
        {showFields === 'displayPatientSearch' || showFields === 'initialPatientSearch' ? (
          <>
            <Grid item>
              <Typography variant="body1">
                Por favor, insira o nome, data de nascimento ou telefone para buscar pacientes cadastrados antes de prosseguir.
              </Typography>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <AddVisitPatientSearchFields
                  lastName={{
                    displayPlaceholder: true,
                    required: false,
                    value: searchFilters.lastName,
                    error: !!errors.lastName,
                    onChange: (e) => setSearchField({ field: 'lastName', value: e.target.value }),
                  }}
                  firstName={{
                    displayPlaceholder: true,
                    required: false,
                    value: searchFilters.givenNames,
                    error: !!errors.firstName,
                    onChange: (e) => setSearchField({ field: 'givenNames', value: e.target.value }),
                  }}
                  phoneNumber={{
                    displayPlaceholder: true,
                    required: false,
                    value: searchFilters.phone,
                    error: !!errors.phone,
                    onValueChange: (values, sourceInfo) => {
                      if (sourceInfo.source === 'event') {
                        setSearchField({ field: 'phone', value: values.value });
                        if (errors.phone && values.value.length === 10) {
                          setErrors({ ...errors, phone: false });
                        }
                      }
                    },
                    dataTestId: dataTestIds.addPatientPage.mobilePhoneInput,
                  }}
                  dateOfBirth={{
                    displayPlaceholder: false,
                    required: false,
                    value: '',
                    birthDate,
                    error: !!errors.dateOfBirth,
                    errorMessage: 'A data de nascimento é obrigatória',
                    setBirthDate: (date) => {
                      setBirthDate(date);
                      setSearchField({ field: 'dateOfBirth', value: date?.toISODate() || '' });
                    },
                    setValidDate,
                    readOnly: false,
                  }}
                />
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <LoadingButton
                    data-testid={dataTestIds.addPatientPage.searchForPatientsButton}
                    type="submit"
                    loading={searching}
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: 28, p: '8px 22px', textTransform: 'none' }}
                    onClick={handlePatientSearchClick}
                  >
                    Buscar Pacientes
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : (
          patientInfo && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {showFields === 'existingPatientSelected' && (
                  <>
                    <AddVisitPatientSearchFields
                      lastName={{
                        displayPlaceholder: false,
                        required: false,
                        value: patientInfo.lastName,
                        error: !!errors.lastName,
                        additionalProps: readOnlyTextFieldProps,
                        // dataTestId: dataTestIds.addPatientPage.prefilledPatientName, // maybe fix?
                      }}
                      firstName={{
                        displayPlaceholder: false,
                        required: false,
                        value: patientInfo.firstName,
                        error: !!errors.firstName,
                        additionalProps: readOnlyTextFieldProps,
                        // dataTestId: dataTestIds.addPatientPage.prefilledPatientName, // maybe fix?
                      }}
                      phoneNumber={{
                        displayPlaceholder: false,
                        required: false,
                        value: patientInfo?.phoneNumber || '',
                        error: !!errors.phone,
                        inputProps: readOnlyTextFieldProps.InputProps,
                      }}
                      dateOfBirth={{
                        displayPlaceholder: false,
                        required: false,
                        value: formattedDOB,
                        error: !!errors.dateOfBirth,
                        errorMessage: 'A data de nascimento é obrigatória',
                        additionalProps: readOnlyTextFieldProps,
                        dataTestId: dataTestIds.addPatientPage.prefilledPatientBirthday,
                        readOnly: true,
                      }}
                    />
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Sexo biológico"
                        value={
                          patientInfo.sex
                            ? GENDER_LABELS_BR[patientInfo.sex.toLowerCase()] || patientInfo.sex
                            : undefined
                        }
                        error={!!errors.sexAtBirth}
                        helperText={errors.sexAtBirth ? 'O sexo biológico é obrigatório' : undefined}
                        {...readOnlyTextFieldProps}
                        data-testid={dataTestIds.addPatientPage.prefilledPatientBirthSex}
                      />
                    </Grid>
                  </>
                )}
                {showFields === 'manuallyEnterPatientDetails' && (
                  <>
                    <AddVisitPatientSearchFields
                      lastName={{
                        displayPlaceholder: true,
                        required: true,
                        value: patientInfo.lastName,
                        error: !!errors.lastName,
                        onChange: (e) => setPatientInfo({ ...patientInfo, lastName: e.target.value }),
                        additionalProps: { required: true },
                        dataTestId: dataTestIds.addPatientPage.lastNameInput,
                      }}
                      firstName={{
                        displayPlaceholder: true,
                        required: true,
                        value: patientInfo.firstName,
                        error: !!errors.firstName,
                        onChange: (e) => setPatientInfo({ ...patientInfo, firstName: e.target.value }),
                        additionalProps: { required: true },
                        dataTestId: dataTestIds.addPatientPage.firstNameInput,
                      }}
                      phoneNumber={{
                        displayPlaceholder: true,
                        required: true,
                        value: patientInfo?.phoneNumber || '',
                        error: !!errors.phone,
                        onValueChange: (values, sourceInfo) => {
                          if (sourceInfo.source === 'event') {
                            setPatientInfo({ ...patientInfo, phoneNumber: values.value });
                            if (errors.phone && values.value.length === 10) {
                              setErrors({ ...errors, phone: false });
                            }
                          }
                        },
                      }}
                      dateOfBirth={{
                        displayPlaceholder: false,
                        required: true,
                        value: '',
                        birthDate,
                        setBirthDate,
                        setValidDate,
                        error: !!errors.dateOfBirth,
                        errorMessage: 'A data de nascimento é obrigatória',
                        readOnly: false,
                      }}
                    />
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.sexAtBirth}>
                        <InputLabel id="sex-at-birth-label">Sexo biológico *</InputLabel>
                        <Select
                          data-testid={dataTestIds.addPatientPage.sexAtBirthDropdown}
                          labelId="sex-at-birth-label"
                          id="sex-at-birth-select"
                          value={patientInfo.sex || ''}
                          label="Sexo biológico *"
                          required
                          onChange={(event) => {
                            const selectedSex = event.target.value as PersonSex;
                            setPatientInfo({ ...patientInfo, sex: selectedSex });
                          }}
                        >
                          <MenuItem value={PersonSex.Male}>Masculino</MenuItem>
                          <MenuItem value={PersonSex.Female}>Feminino</MenuItem>
                          <MenuItem value={PersonSex.Intersex}>Outro / Intersexo</MenuItem>
                        </Select>
                        {errors.sexAtBirth && <FormHelperText>O sexo biológico é obrigatório</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    sx={{ borderRadius: 28, p: '8px 22px', textTransform: 'none' }}
                    onClick={handleResetSearch}
                  >
                    Nova Busca
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )
        )}
      </Grid>

      {errors.searchEntry && (
        <Typography color="error" variant="body2" mb={2}>
          Por favor, preencha pelo menos um campo para buscar
        </Typography>
      )}

      {/* Patient Search Results Dialog */}
      <AddVisitPatientSearchDialog
        openSearchResults={openSearchResults}
        setOpenSearchResults={setOpenSearchResults}
        selectedPatient={selectedPatient}
        setSelectedPatient={setSelectedPatient}
        patients={patients}
        handleSelectExistingPatient={handleSelectExistingPatient}
        handleManuallyEnterPatientDetails={handleManuallyEnterPatientDetails}
      />
    </>
  );
};
