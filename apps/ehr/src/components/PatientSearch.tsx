import { Close, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { ChangeEvent, Dispatch, ReactElement, SetStateAction } from 'react';

interface PatientSearchProps {
  nameFilter: string | null;
  setNameFilter: Dispatch<SetStateAction<string | null>>;
  onClear?: () => void;
}

export default function PatientSearch({ nameFilter, setNameFilter, onClear }: PatientSearchProps): ReactElement {
  return (
    <TextField
      id="patient-name"
      label="Nome do Paciente"
      placeholder="Buscar pacientes por nome (Sobrenome, Nome)"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {nameFilter && nameFilter?.length > 0 ? (
              <IconButton
                aria-label="limpar busca de pacientes"
                onClick={() => {
                  if (onClear) {
                    onClear();
                  }
                  setNameFilter(null);
                }}
                onMouseDown={(event) => event.preventDefault()}
                sx={{ p: 0 }}
              >
                <Close />
              </IconButton>
            ) : (
              <Search />
            )}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{ shrink: true }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setNameFilter(event.target.value);
      }}
      sx={{ mr: 2, mb: 2 }}
      fullWidth
      value={nameFilter ?? ''}
    />
  );
}
