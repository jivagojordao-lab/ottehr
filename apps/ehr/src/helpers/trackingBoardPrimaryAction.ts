import { dataTestIds } from 'src/constants/data-test-ids';
import { VisitStatusLabel, VisitStatusWithoutUnknown } from 'utils/lib/types/api/appointment.types';

export interface TrackingBoardPrimaryAction {
  dataTestId: string;
  label: string;
  missingUserMessage: string;
  navigateToChart?: boolean;
  skipStatusUpdate?: boolean;
  successMessage?: string;
  updatedStatus: VisitStatusWithoutUnknown;
}

interface TrackingBoardPrimaryActionOptions {
  isVirtualVisit?: boolean;
}

type ActionableVisitStatus = 'arrived' | 'ready' | 'intake' | 'ready for provider' | 'provider';

const trackingBoardPrimaryActions = {
  arrived: {
    dataTestId: dataTestIds.dashboard.readyButton,
    label: 'Pronto',
    missingUserMessage: 'Usuário não autenticado. Não é possível marcar paciente como pronto.',
    successMessage: 'Paciente marcado como pronto',
    updatedStatus: 'ready',
  },
  ready: {
    dataTestId: dataTestIds.dashboard.intakeButton,
    label: 'Iniciar Triagem',
    missingUserMessage: 'Usuário não autenticado. Não é possível iniciar triagem.',
    navigateToChart: true,
    updatedStatus: 'intake',
  },
  intake: {
    dataTestId: dataTestIds.dashboard.completeIntakeButton,
    label: 'Finalizar Triagem',
    missingUserMessage: 'Usuário não autenticado. Não é possível finalizar triagem.',
    successMessage: 'Triagem concluída',
    updatedStatus: 'ready for provider',
  },
  'ready for provider': {
    dataTestId: dataTestIds.dashboard.startProviderButton,
    label: 'Iniciar Atendimento',
    missingUserMessage: 'Usuário não autenticado. Não é possível iniciar atendimento.',
    successMessage: 'Atendimento médico iniciado',
    updatedStatus: 'provider',
  },
  provider: {
    dataTestId: dataTestIds.dashboard.dischargeButton,
    label: 'Dar Alta',
    missingUserMessage: 'Usuário não autenticado. Não é possível registrar alta.',
    successMessage: 'Alta registrada com sucesso',
    updatedStatus: 'discharged',
  },
} satisfies Record<ActionableVisitStatus, TrackingBoardPrimaryAction>;

export const getTrackingBoardPrimaryAction = (
  status: VisitStatusLabel,
  options?: TrackingBoardPrimaryActionOptions
): TrackingBoardPrimaryAction | undefined => {
  if (!(status in trackingBoardPrimaryActions)) {
    return undefined;
  }

  const action = trackingBoardPrimaryActions[status as ActionableVisitStatus];

  if (status === 'ready for provider' && options?.isVirtualVisit) {
    return {
      ...action,
      navigateToChart: true,
      skipStatusUpdate: true,
      successMessage: undefined,
    };
  }

  return action;
};
