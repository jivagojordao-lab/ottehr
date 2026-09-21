import { AppointmentType } from 'utils/lib/types/api/appointment.types';
import { ServiceMode } from 'utils/lib/types/common';

export const formatLabelValue = (
  value: string | undefined,
  placeholder = '',
  keepPlaceholderIfValueFulfilled = false,
  emptyValuePlaceholder = 'N/A'
): string => {
  const shouldAddPrefix = !!placeholder && (!value || (keepPlaceholderIfValueFulfilled && value));
  const prefix = shouldAddPrefix ? `${placeholder}: ` : '';
  return prefix + (value || emptyValuePlaceholder);
};

export const getVisitTypeLabelForTypeAndServiceMode = (input: {
  type?: AppointmentType;
  serviceMode?: ServiceMode;
}): string => {
  const { type, serviceMode = 'in-person' } = input;
  switch (type) {
    case 'walk-in':
      if (serviceMode === 'virtual') {
        return 'Telemedicina - Demanda Espontânea';
      } else {
        return 'Presencial - Demanda Espontânea';
      }
    case 'pre-booked':
      if (serviceMode === 'virtual') {
        return 'Telemedicina - Agendado';
      } else {
        return 'Presencial - Agendado';
      }
    case 'post-telemed':
      return 'Presencial - Pós-Telemedicina';
    default: {
      return '-';
    }
  }
};
