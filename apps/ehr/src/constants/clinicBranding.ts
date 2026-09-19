/**
 * Configurações de Identidade Visual e Branding da Clínica
 *
 * Para personalizar a clínica:
 * 1. Altere o nome e subtítulo da clínica abaixo.
 * 2. Para alterar as cores, mude `primaryColor` (ou configure a variável de ambiente VITE_APP_PRIMARY_COLOR).
 * 3. Para alterar o logotipo:
 *    - Coloque o arquivo em `apps/ehr/public/logo.png` ou `public/logo.svg`
 *    - Ou preencha a propriedade `logoUrl` abaixo com o caminho ou URL
 *    - Caso `logoUrl` esteja vazio, o sistema exibe automaticamente o logotipo vetorial estilizado da clínica.
 */

export interface ClinicBrandingConfig {
  name: string;
  shortName: string;
  subtitle: string;
  primaryColor: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  logoUrl?: string;
  domain: string;
  email: string;
  phone: string;
}

export const CLINIC_BRANDING: ClinicBrandingConfig = {
  // Nome da instituição / clínica
  name: (import.meta as any).env?.VITE_APP_CLINIC_NAME || 'Alliance Centro Médico',
  shortName: (import.meta as any).env?.VITE_APP_ORGANIZATION_NAME_SHORT || 'Alliance',
  subtitle: 'Centro Médico',

  // Cores institucionais (Azul Royal Oficial)
  primaryColor: (import.meta as any).env?.VITE_APP_PRIMARY_COLOR || '#1877F2',
  primaryHover: '#0D5BBD',
  primaryLight: '#E8F2FD',
  primaryDark: '#0B4A9E',

  // Logotipo personalizado
  // Deixe vazio para usar o design vetorial moderno padrão, ou passe '/logo.png'
  logoUrl: (import.meta as any).env?.VITE_APP_LOGO_URL || '',

  // Dados institucionais
  domain: 'alliancecentromedico.com.br',
  email: 'contato@alliancecentromedico.com.br',
  phone: '(11) 3000-0000',
};
