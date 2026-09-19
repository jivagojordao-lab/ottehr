import { TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { ReactElement } from 'react';
import {
  ACTION_WIDTH_MIN,
  CHAT_WIDTH_MIN,
  INTAKE_AND_PROVIDER_WIDTH_MIN,
  NOTES_WIDTH_MIN,
  PATIENT_AND_REASON_WIDTH_MIN,
  PROVIDER_WIDTH_MIN,
  ROOM_WIDTH_MIN,
  TIME_WIDTH_MIN,
  TYPE_WIDTH_MIN,
  VISIT_ICONS_WIDTH_MIN,
  VITALS_ICON_WIDTH_MIN,
} from '../constants';
import { ApptTab } from './AppointmentTabs';

interface AppointmentTableHeaderProps {
  tab: ApptTab;
  table?: 'waiting-room' | 'in-exam';
}

export default function AppointmentTableHeader({ tab, table }: AppointmentTableHeaderProps): ReactElement {
  return (
    <TableHead>
      <TableRow sx={{ '& .MuiTableCell-root': { px: 1.5 }, display: { xs: 'none', sm: 'none', md: 'table-row' } }}>
        <TableCell sx={{ width: '40px', p: 0 }}></TableCell>
        <TableCell sx={{ width: TYPE_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
            {tab !== ApptTab.prebooked ? 'Tipo & Status' : 'Tipo'}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: TIME_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
            Horário
          </Typography>
        </TableCell>
        <TableCell sx={{ width: PATIENT_AND_REASON_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
            Paciente & Motivo
          </Typography>
        </TableCell>
        {(tab === ApptTab['in-office'] || tab === ApptTab.completed) && (
          <TableCell sx={{ width: ROOM_WIDTH_MIN }}>
            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
              Sala
            </Typography>
          </TableCell>
        )}
        <TableCell sx={{ width: tab === ApptTab.prebooked ? PROVIDER_WIDTH_MIN : INTAKE_AND_PROVIDER_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {tab === ApptTab.prebooked ? 'Profissional' : 'Triagem & Médico'}
          </Typography>
        </TableCell>
        {((tab === ApptTab['in-office'] && table === 'in-exam') || tab === ApptTab.completed) && (
          <TableCell sx={{ width: VITALS_ICON_WIDTH_MIN }}>
            <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
              Sinais Vitais
            </Typography>
          </TableCell>
        )}
        <TableCell sx={{ width: VISIT_ICONS_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {tab === ApptTab.completed || (tab === ApptTab['in-office'] && table === 'in-exam')
              ? 'Prescrições / Pedidos'
              : 'Etapas'}
          </Typography>
        </TableCell>
        <TableCell sx={{ width: NOTES_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
            Observações
          </Typography>
        </TableCell>
        <TableCell sx={{ width: CHAT_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600 }}>
            Chat
          </Typography>
        </TableCell>
        <TableCell sx={{ width: CHAT_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
            Acessar
          </Typography>
        </TableCell>
        <TableCell sx={{ width: ACTION_WIDTH_MIN }}>
          <Typography variant="subtitle2" sx={{ fontSize: '14px', fontWeight: 600, textAlign: 'center' }}>
            Ações
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
