import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, FormControl, MenuItem, TextField } from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import DateSearch from '../../../../../components/DateSearch';
import { dataTestIds } from '../../../../../constants/data-test-ids';
import { PartialSearchOptionsState, SearchOptionsFilters } from './types';
import { useLocationsOptions } from './useLocationsOptions';

export const PatientsSearchFilters: React.FC<{
  searchFilters: SearchOptionsFilters;
  setSearchField: ({ field, value }: { field: keyof SearchOptionsFilters; value: string }) => void;
  resetFilters: () => void;
  search: (overriddenParams?: PartialSearchOptionsState) => void;
}> = ({ searchFilters, setSearchField, resetFilters: resetFilters, search }) => {
  const [showAdditionalSearch, setShowAdditionalSearch] = useState(true);
  const { location: locationOptions } = useLocationsOptions();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    search({ pagination: { offset: 0 } });
  };

  return (
    <FormControl component="form" onSubmit={handleSubmit} fullWidth>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          data-testid="search-by-cpf-field"
          sx={{ flex: 1 }}
          label="CPF"
          placeholder="000.000.000-00"
          value={searchFilters.cpf || ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
            let masked = raw;
            if (raw.length > 9) masked = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
            else if (raw.length > 6) masked = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
            else if (raw.length > 3) masked = `${raw.slice(0, 3)}.${raw.slice(3)}`;
            setSearchField({ field: 'cpf', value: masked });
          }}
        />
        <TextField
          data-testid={dataTestIds.patients.searchByGivenNamesField}
          sx={{ flex: 1 }}
          label="Nome do Paciente"
          placeholder="Ex: Maria"
          value={searchFilters.givenNames}
          onChange={(e) => setSearchField({ field: 'givenNames', value: e.target.value })}
        />
        <TextField
          data-testid={dataTestIds.patients.searchByLastNameField}
          sx={{ flex: 1 }}
          label="Sobrenome"
          placeholder="Ex: Silva"
          value={searchFilters.lastName}
          onChange={(e) => setSearchField({ field: 'lastName', value: e.target.value })}
        />
        <Box sx={{ flex: 1 }}>
          <DateSearch
            date={searchFilters.dob ? DateTime.fromISO(searchFilters.dob) : null}
            setDate={(date: DateTime | null) =>
              setSearchField({ field: 'dob', value: date ? date.toISODate() || '' : '' })
            }
            label="Data de Nasc."
            closeOnSelect
            data-testid={dataTestIds.patients.searchByDateOfBirthField}
          />
        </Box>
        <TextField
          data-testid={dataTestIds.patients.searchByPidField}
          sx={{ flex: 0.8 }}
          label="PID / UUID"
          placeholder="ID do paciente"
          value={searchFilters.pid}
          onChange={(e) => setSearchField({ field: 'pid', value: e.target.value })}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button
          type="button"
          onClick={() => setShowAdditionalSearch(!showAdditionalSearch)}
          startIcon={showAdditionalSearch ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          color="primary"
        >
          {showAdditionalSearch ? 'Menos filtros de busca' : 'Mais filtros de busca'}
        </Button>
      </Box>

      {showAdditionalSearch && (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 3 }}>
          <TextField
            label="Telefone / Celular"
            data-testid={dataTestIds.patients.searchByPhoneField}
            placeholder="(00) 00000-0000"
            value={searchFilters.phone}
            onChange={(e) => setSearchField({ field: 'phone', value: e.target.value })}
          />
          <TextField
            label="Endereço / Cidade"
            data-testid={dataTestIds.patients.searchByAddressField}
            placeholder="Rua, Bairro ou Cidade"
            value={searchFilters.address}
            onChange={(e) => setSearchField({ field: 'address', value: e.target.value })}
          />
          <TextField
            label="E-mail"
            data-testid={dataTestIds.patients.searchByEmailField}
            placeholder="exemplo@email.com"
            value={searchFilters.email}
            onChange={(e) => setSearchField({ field: 'email', value: e.target.value })}
          />
          <FormControl fullWidth>
            <TextField
              data-testid={dataTestIds.patients.searchByStatusName}
              select
              label="Status do Paciente"
              value={searchFilters.status}
              onChange={(e) => setSearchField({ field: 'status', value: e.target.value })}
            >
              <MenuItem value="All">Todos</MenuItem>
              <MenuItem value="Active">Ativo</MenuItem>
              <MenuItem value="Deceased">Falecido</MenuItem>
              <MenuItem value="Inactive">Inativo</MenuItem>
            </TextField>
          </FormControl>
          <FormControl fullWidth>
            <TextField
              data-testid={dataTestIds.patients.searchByLocationName}
              select
              label="Unidade / Unidade de Saúde"
              value={searchFilters.location}
              onChange={(e) => setSearchField({ field: 'location', value: e.target.value })}
            >
              <MenuItem value="All">Todas as Unidades</MenuItem>
              {locationOptions.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Box>
      )}

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'end', gap: 3 }}>
        <Button type="button" onClick={resetFilters} data-testid={dataTestIds.patients.resetFiltersButton}>
          Limpar Filtros
        </Button>
        <Button
          data-testid={dataTestIds.patients.searchButton}
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          type="submit"
          sx={{ mr: 1, borderRadius: 28 }}
        >
          Pesquisar
        </Button>
      </Box>
    </FormControl>
  );
};
