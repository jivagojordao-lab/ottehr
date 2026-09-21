import AddIcon from '@mui/icons-material/Add';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Address } from 'fhir/r4b';
import { ReactElement, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BooleanStateChip } from 'src/components/BooleanStateChip';
import { useCreateLocationMutation, useLocationsListQuery } from './location.queries';

const addressString = (address: Address): string =>
  [address.line?.join(', '), address.city, address.state, address.postalCode].filter(Boolean).join(', ');

type StatusFilter = 'all' | 'active' | 'inactive';

/**
 * Lists every Location — schedule-owning or not — and links to its config page.
 * Unlike the Schedules "Locations" tab (which only surfaces schedule owners), this
 * reaches anchor-only Locations too, since Location config is now independent of
 * whether a Location owns a schedule.
 */
export default function LocationsListPage(): ReactElement {
  const { data: locations, isLoading } = useLocationsListQuery();
  const navigate = useNavigate();
  const createMutation = useCreateLocationMutation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = (): void => {
    const name = newName.trim();
    if (!name) return;
    createMutation.mutate(
      { name },
      {
        onSuccess: (created) => {
          setAddOpen(false);
          setNewName('');
          if (created.id) navigate(`/admin/locations/${created.id}`);
        },
      }
    );
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (locations ?? []).filter((location) => {
      const isActive = location.status === 'active';
      if (statusFilter === 'active' && !isActive) return false;
      if (statusFilter === 'inactive' && isActive) return false;
      if (term && !`${location.name ?? ''} ${location.id ?? ''}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [locations, search, statusFilter]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    // Self-contained scroll region so the filters + header stay pinned regardless of
    // ancestor `overflow` (which would otherwise hijack `position: sticky`). The table
    // body scrolls inside this Paper; the page itself does not need to scroll.
    <Paper sx={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 180px)' }}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          flexWrap: 'wrap',
          flexShrink: 0,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <TextField
          size="small"
          label="Buscar por nome ou ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 260 }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="active">Apenas ativos</MenuItem>
          <MenuItem value="inactive">Apenas inativos</MenuItem>
        </TextField>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)} sx={{ ml: 'auto' }}>
          Adicionar Unidade
        </Button>
      </Box>
      <TableContainer sx={{ overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((location) => (
              <TableRow
                key={location.id}
                hover
                onClick={() => navigate(`/admin/locations/${location.id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Typography variant="body2">{location.name || '-'}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {location.id}
                  </Typography>
                </TableCell>
                <TableCell>{location.address ? addressString(location.address) : '—'}</TableCell>
                <TableCell>
                  <BooleanStateChip
                    state={location.status === 'active'}
                    label={location.status === 'active' ? 'Ativo' : 'Inativo'}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography color="text.secondary">Nenhuma unidade encontrada com os filtros atuais.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Adicionar Unidade</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nome da Unidade"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreate();
              }
            }}
            fullWidth
            sx={{ mt: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Cria uma unidade presencial ativa com base no nome informado — configure o endereço, modalidades e demais opções na próxima página.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancelar</Button>
          <LoadingButton
            variant="contained"
            onClick={handleCreate}
            loading={createMutation.isPending}
            disabled={!newName.trim()}
          >
            Criar Unidade
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
