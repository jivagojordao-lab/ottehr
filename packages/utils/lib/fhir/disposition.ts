import { DispositionType } from '../types/api/chart-data/chart-data.types';

const pcpLabel = 'Médico de Família / Atenção Primária';

export const mapDispositionTypeToLabel: Record<DispositionType, string> = {
  ip: 'Transferência Interna (Internação)',
  'ip-lab': 'Coleta / Exame Interno',
  pcp: pcpLabel,
  ed: 'Transferência para Emergência (UPA/Hospital)',
  'ip-oth': 'Transferência Externa',
  'pcp-no-type': pcpLabel,
  another: 'Transferência para Outra Unidade',
  specialty: 'Encaminhamento para Especialidade',
};

export const OTHER_SPECIALTY_TRANSFER_OPTION = 'Outro';

export const specialtyTransferOptions = [
  'Alergologista',
  'Cardiologista',
  'Dermatologista',
  'Diagnóstico por Imagem',
  'Otorrinolaringologia',
  'Medicina de Família e Comunidade',
  'Gastroenterologia',
  'Cirurgia Geral',
  'Neurologia',
  'Oftalmologia',
  'Ortopedia',
  'Pediatria',
  'Fisioterapia',
  OTHER_SPECIALTY_TRANSFER_OPTION,
];

/**
 * Builds the human-readable specialty-transfer string. When the selected specialty is "Other",
 * the free-text the provider typed is shown (falling back to "Other" when no text was entered).
 */
export const getSpecialtyTransferDisplay = (specialty?: string, specialtyOther?: string): string | undefined => {
  if (specialty === OTHER_SPECIALTY_TRANSFER_OPTION) {
    return specialtyOther?.trim() || OTHER_SPECIALTY_TRANSFER_OPTION;
  }
  return specialty || undefined;
};

export const dispositionCheckboxOptions = [
  {
    label: 'Odontologia',
    name: 'dentistry',
  },
  {
    label: 'Otorrinolaringologia',
    name: 'ent',
  },
  {
    label: 'Oftalmologia',
    name: 'ophthalmology',
  },
  {
    label: 'Ortopedia',
    name: 'orthopedics',
  },
  {
    label: 'Outro',
    name: 'other',
  },
  // {
  //   label: 'Lurie CT',
  //   name: 'lurie-ct',
  // },
] as const;
