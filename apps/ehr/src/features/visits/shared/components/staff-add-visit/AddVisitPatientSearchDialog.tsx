import { Box, Button, Dialog, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { FC } from 'react';
import { dataTestIds } from 'src/constants/data-test-ids';
import { AddVisitPatientInfo } from 'src/pages/AddPatient';

interface AddVisitPatientSearchDialogProps {
  openSearchResults: boolean;
  setOpenSearchResults: (open: boolean) => void;
  selectedPatient: AddVisitPatientInfo | undefined;
  setSelectedPatient: (patient: AddVisitPatientInfo | undefined) => void;
  patients: AddVisitPatientInfo[];
  handleSelectExistingPatient: () => void;
  handleManuallyEnterPatientDetails: () => void;
}
export const AddVisitPatientSearchDialog: FC<AddVisitPatientSearchDialogProps> = ({
  openSearchResults,
  setOpenSearchResults,
  selectedPatient,
  setSelectedPatient,
  patients,
  handleSelectExistingPatient,
  handleManuallyEnterPatientDetails,
}) => {
  const getFullNameFromPatientInfo = (patient: AddVisitPatientInfo): string => {
    return `${patient.firstName}${patient.middleName ? ` ${patient.middleName}` : ''} ${patient.lastName}`;
  };

  return (
    <Dialog
      open={openSearchResults}
      onClose={() => {
        setSelectedPatient(undefined);
        setOpenSearchResults(false);
      }}
    >
      <Box sx={{ minWidth: '600px', borderRadius: '4px', p: '35px', maxHeight: '450px', overflow: 'scroll' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: '600 !important', color: 'primary.main', marginBottom: '4px' }}>
            Selecionar Paciente
          </Typography>
        </Box>
        <Box>
          <RadioGroup
            onChange={(e) => {
              const id = e.target.value;
              const patient = patients.find((p) => p.id === id);
              setSelectedPatient(patient);
            }}
          >
            {patients.map((patient) => {
              const dob = patient?.dateOfBirth
                ? DateTime.fromISO(patient.dateOfBirth).setLocale('pt-BR').toFormat('dd/MM/yyyy')
                : '-';
              const label = `${getFullNameFromPatientInfo(patient)} (Nasc: ${dob})`;
              return <FormControlLabel key={patient.id} value={patient.id} control={<Radio />} label={label} />;
            })}
          </RadioGroup>
        </Box>
        {selectedPatient && (
          <Box sx={{ marginTop: 2 }}>
            <Button
              data-testid={dataTestIds.addPatientPage.prefillForButton}
              variant="outlined"
              sx={{
                borderRadius: 100,
                textTransform: 'none',
                fontWeight: 600,
              }}
              onClick={handleSelectExistingPatient}
            >
              Selecionar {getFullNameFromPatientInfo(selectedPatient)}
            </Button>
          </Box>
        )}
        <Box sx={{ marginTop: 2 }}>
          <Button
            data-testid={dataTestIds.addPatientPage.patientNotFoundButton}
            variant="contained"
            sx={{
              borderRadius: 100,
              textTransform: 'none',
              fontWeight: 600,
            }}
            onClick={handleManuallyEnterPatientDetails}
          >
            Paciente não encontrado - Cadastrar Manualmente
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
