import Oystehr, { OystehrConfig } from '@oystehr/sdk';
import { BILLING_RESOURCE_TAG } from 'utils/lib/fhir/constants';

function getAbsoluteUrl(url?: string, fallbackPath = ''): string | undefined {
  if (!url && !fallbackPath) return undefined;
  const target = url || fallbackPath;
  if (target.startsWith('http://') || target.startsWith('https://')) return target;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}${target.startsWith('/') ? target : `/${target}`}`;
  }
  return `http://localhost:8103${target.startsWith('/') ? target : `/${target}`}`;
}

export function createClinicalOystehrClient(token?: string, overrides?: Partial<OystehrConfig>): Oystehr {
  const fhirApiUrl = getAbsoluteUrl(import.meta.env.VITE_APP_FHIR_API_URL, '/fhir/R4');
  const projectApiUrl = getAbsoluteUrl(import.meta.env.VITE_APP_PROJECT_API_URL, '/local-api');
  const zambdaApiUrl = getAbsoluteUrl(
    import.meta.env.VITE_APP_IS_LOCAL === 'true'
      ? import.meta.env.VITE_APP_PROJECT_API_ZAMBDA_URL || '/local-api'
      : import.meta.env.VITE_APP_PROJECT_API_URL || '/local-api',
    '/local-api'
  );

  return new Oystehr({
    accessToken: token,
    services: {
      fhirApiUrl,
      projectApiUrl,
      zambdaApiUrl,
    },
    projectId: import.meta.env.VITE_APP_PROJECT_ID || 'ottehr-brasil',
    ...overrides,
    ignoreTags: [...(overrides?.ignoreTags ?? []), BILLING_RESOURCE_TAG],
  });
}
