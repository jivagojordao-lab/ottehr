import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { ReactElement, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cancelTelemedAppointment } from 'src/api/api';
import { useApiClients } from 'src/hooks/useAppClients';
import { VALUE_SETS } from 'utils/lib/ottehr-config/value-sets';

interface CancelVisitDialogProps {
  onClose: () => void;
}

const CANCEL_REASON_LABELS_BR: Record<string, string> = {
  'Patient did not answer after multiple attempts': 'Paciente não atendeu após várias tentativas',
  'Wrong patient name on chart': 'Nome de paciente incorreto no prontuário',
  'Technical issues connecting and/ or with video': 'Problemas técnicos de conexão ou vídeo',
  Other: 'Outro motivo',
};

const CancelVisitDialog = ({ onClose }: CancelVisitDialogProps): ReactElement => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<boolean>(false);
  const [otherReason, setOtherReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const { oystehrZambda } = useApiClients();
  const { id: appointmentID } = useParams();
  const navigate = useNavigate();

  const cancellationReasons = VALUE_SETS.cancelReasonOptionsVirtualProvider;

  const handleReasonChange = (event: SelectChangeEvent<string>): void => {
    setReason(event.target.value);
    if (event.target.value !== 'Other') {
      setOtherReason('');
    }
  };

  const handleOtherReasonChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setOtherReason(event.target.value);
  };

  const handleCancelAppointment = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setError(false);
    if (!reason || (reason === 'Other' && !otherReason)) {
      return;
    }
    setIsCancelling(true);
    if (!oystehrZambda) throw new Error('Zambda client not found');

    const typedReason = cancellationReasons.find((r) => r.value === reason);

    if (!typedReason) {
      throw new Error(`Invalid cancellation reason: ${reason}`);
    }

    let errorReceived = false;
    try {
      const response = await cancelTelemedAppointment(oystehrZambda, {
        appointmentID: appointmentID || '',
        cancellationReason: typedReason.value,
        cancellationReasonAdditional: otherReason,
      });
      console.log('Appointment cancelled successfully', response);
    } catch (error) {
      setError(true);
      errorReceived = true;
      console.error('Failed to cancel appointment', error);
    } finally {
      setIsCancelling(false);
      if (!errorReceived) {
        onClose();
        navigate('/visits');
      }
    }
  };

  const buttonSx = {
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: 6,
    mb: 2,
    ml: 1,
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      disableScrollLock
      sx={{
        '.MuiPaper-root': {
          padding: 1,
          width: '444px',
          maxWidth: 'initial',
        },
      }}
    >
      <form onSubmit={(e) => handleCancelAppointment(e)}>
        <DialogTitle variant="h4" color="primary.dark" sx={{ width: '100%' }}>
          Motivo do Cancelamento
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth required sx={{ mt: 2 }}>
            <InputLabel id="cancellation-reason-label">Motivo do Cancelamento</InputLabel>
            <Select
              labelId="cancellation-reason-label"
              id="cancellation-reason"
              value={reason}
              label="Motivo do Cancelamento"
              onChange={handleReasonChange}
            >
              {cancellationReasons.map((reason) => (
                <MenuItem key={reason.value} value={reason.value}>
                  {CANCEL_REASON_LABELS_BR[reason.label] || reason.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {reason === 'Other' && (
            <FormControl fullWidth required>
              <TextField
                id="other-reason"
                label="Descreva o motivo"
                variant="outlined"
                fullWidth
                required={true}
                margin="normal"
                value={otherReason}
                onChange={handleOtherReasonChange}
              />
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-start', marginLeft: 1 }}>
          <LoadingButton
            loading={isCancelling}
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            sx={buttonSx}
          >
            Cancelar Atendimento
          </LoadingButton>
          <Button onClick={onClose} variant="text" color="primary" size="medium" sx={buttonSx}>
            Manter Atendimento
          </Button>
        </DialogActions>
        {error && (
          <Typography color="error" variant="body2" my={1} mx={2}>
            Ocorreu um erro ao cancelar este atendimento, por favor tente novamente.
          </Typography>
        )}
      </form>
    </Dialog>
  );
};

export default CancelVisitDialog;
