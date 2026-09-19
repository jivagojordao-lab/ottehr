import { Button } from '@mui/material';
import { FC } from 'react';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog';

type ClearChartSectionButtonProps = {
  /** Button and dialog-confirm label, e.g. "Clear Exam". */
  label: string;
  /** Section name interpolated into the confirmation copy, e.g. "Exam". */
  sectionName: string;
  onClear: () => void;
  disabled?: boolean;
  dataTestId?: string;
};

/**
 * Destructive "clear everything in this chart section" action, rendered inline with the page title.
 * The clear itself is not undoable, so it always goes through a confirmation dialog.
 */
export const ClearChartSectionButton: FC<ClearChartSectionButtonProps> = ({
  label,
  sectionName,
  onClear,
  disabled,
  dataTestId,
}) => (
  <ConfirmationDialog
    title={label}
    description={`Tem certeza de que deseja limpar todos os itens selecionados de ${sectionName}? Esta ação não pode ser desfeita.`}
    showCloseButton
    response={onClear}
    actionButtons={{
      // The confirm is gated too, not just the button that opens the dialog: a write can start
      // (a debounced comment, another section's bulk save) while the dialog sits open, and
      // clearing on top of it would only clear the local copy.
      proceed: { text: label, color: 'error', disabled },
      back: { text: 'Cancelar' },
      reverse: true,
    }}
  >
    {(showDialog) => (
      <Button
        variant="text"
        color="error"
        size="small"
        onClick={showDialog}
        disabled={disabled}
        data-testid={dataTestId}
        sx={{ fontWeight: 700, textTransform: 'none' }}
      >
        {label}
      </Button>
    )}
  </ConfirmationDialog>
);
