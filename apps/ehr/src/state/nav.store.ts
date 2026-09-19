import { create } from 'zustand';

export type AppTab = 'Tracking Board' | 'Patients' | 'Admin' | 'Tasks' | 'Reports';

export const APP_TAB_LABELS: Record<AppTab, string> = {
  'Tracking Board': 'Painel de Atendimentos',
  Patients: 'Pacientes',
  Admin: 'Administração',
  Tasks: 'Tarefas',
  Reports: 'Relatórios',
};

interface NavState {
  currentTab?: string;
}

export const useNavStore = create<NavState>()(() => ({
  currentTab: undefined,
}));
