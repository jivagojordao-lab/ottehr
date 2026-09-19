import type { BrandingConfig, LogoConfig } from 'config-types';

const BRANDING_DATA: BrandingConfig = {
  projectName: 'Alliance Centro Médico',
  projectDomain: 'alliancecentromedico.com.br',
  email: {
    logoURL: '',
    palette: {
      deemphasizedText: '#00000061',
      headerText: '#1877F2',
      bodyText: '#000000DE',
      footerText: '#212130',
      buttonColor: '#1877F2',
    },
    sender: 'contato@alliancecentromedico.com.br',
  },
  logo: {
    default: '',
    email: '',
    pdf: '',
  },
  intake: {
    primaryIconAlt: 'Alliance Centro Médico',
    welcomeTitleBreak: false,
    primaryIconSize: 90,
    appBar: {
      backgroundColor: '#1877F2',
      logoHeight: '39px',
      logoutButtonTextColor: '#FFFFFF',
    },
  },
};

export const BRANDING_CONFIG = Object.freeze(BRANDING_DATA);

// Derived constant - defined here to avoid circular dependencies
// (types/constants.ts cannot import from ottehr-config without creating a cycle)
export const PROJECT_WEBSITE = `https://${BRANDING_CONFIG.projectDomain}`;

type LogoTarget = Exclude<keyof LogoConfig, 'default'>;

export function getLogoFor(target: LogoTarget): string | undefined {
  const { logo } = BRANDING_CONFIG;

  return logo?.[target] || logo?.default;
}
