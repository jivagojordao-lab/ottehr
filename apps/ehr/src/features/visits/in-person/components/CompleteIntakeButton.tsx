import { Button } from '@mui/material';
import { Box } from '@mui/system';
import React, { useCallback, useMemo } from 'react';
import { VisitStatusLabel } from 'utils/lib/types/api/appointment.types';
import { GenericToolTip } from '../../../../components/GenericToolTip';
import { dataTestIds } from '../../../../constants/data-test-ids';
import { AbnormalVitalsContent } from '../../shared/components/vitals/components/AbnormalVitalsContent';
import { useGetAbnormalVitals } from '../../shared/components/vitals/hooks/useGetVitals';
import { useReactNavigationBlocker } from '../../shared/hooks/useReactNavigationBlocker';

export const CompleteIntakeButton: React.FC<{
  isDisabled: boolean;
  handleCompleteIntake: () => void | Promise<unknown>;
  status: VisitStatusLabel | undefined;
}> = ({ isDisabled, handleCompleteIntake, status }) => {
  const abnormalVitals = useGetAbnormalVitals();

  const hasAny = useMemo(
    () =>
      abnormalVitals ? Object.values(abnormalVitals).some((list) => Array.isArray(list) && list.length > 0) : false,
    [abnormalVitals]
  );

  const shouldBlock = useCallback(() => hasAny, [hasAny]);

  const { ConfirmationModal, requestConfirmation } = useReactNavigationBlocker(
    shouldBlock,
    'Você inseriu um valor alterado de sinal vital. Por favor, verifique:',
    { interceptNavigation: false }
  );

  const onClick = useCallback(async () => {
    if (isDisabled) return;
    const canProceed = await requestConfirmation();
    if (!canProceed) return; // user pressed Back
    await handleCompleteIntake();
  }, [isDisabled, requestConfirmation, handleCompleteIntake]);

  return (
    <GenericToolTip
      title={status !== 'intake' ? 'Disponível apenas no status Triagem' : null}
      sx={{ width: '120px', textAlign: 'center' }}
      placement="top"
    >
      <Box sx={{ alignSelf: 'center' }}>
        <Button
          data-testid={dataTestIds.sideMenu.completeIntakeButton}
          variant="contained"
          sx={{ alignSelf: 'center', borderRadius: '20px', textTransform: 'none' }}
          onClick={onClick}
          disabled={isDisabled}
        >
          Finalizar Triagem
        </Button>

        <ConfirmationModal
          title="Valor de Sinal Vital Alterado"
          confirmText="Voltar"
          closeButtonText="Continuar"
          ContentComponent={<AbnormalVitalsContent />}
        />
      </Box>
    </GenericToolTip>
  );
};
