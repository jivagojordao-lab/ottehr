import Oystehr from '@oystehr/sdk';
import { useEffect } from 'react';
import { createClinicalOystehrClient } from 'ui-components/lib/utils/oystehr';
import { getSelectors } from 'utils/lib/store';
import { create } from 'zustand';
import { useAuthToken } from './useAuthToken';

interface ApiClientsState {
  oystehr?: Oystehr;
  oystehrZambda?: Oystehr;
}

const useApiClientsStore = create<ApiClientsState>()(() => ({
  oystehr: undefined,
  oystehrZambda: undefined,
}));

export function useApiClients(): ApiClientsState {
  const token = useAuthToken();
  const { oystehr, oystehrZambda } = getSelectors(useApiClientsStore, ['oystehr', 'oystehrZambda']);

  useEffect(() => {
    if (token && (!oystehr || oystehr.config.accessToken !== token)) {
      useApiClientsStore.setState({
        oystehr: createClinicalOystehrClient(token),
      });
    }
  }, [oystehr, token]);

  useEffect(() => {
    if (!oystehrZambda || oystehrZambda.config.accessToken !== token) {
      const getAbsoluteUrl = (url?: string, fallback = ''): string => {
        const target = url || fallback;
        if (target.startsWith('http://') || target.startsWith('https://')) return target;
        if (typeof window !== 'undefined' && window.location?.origin) {
          return `${window.location.origin}${target.startsWith('/') ? target : `/${target}`}`;
        }
        return `http://localhost:3000${target.startsWith('/') ? target : `/${target}`}`;
      };

      const fhirApiUrl = getAbsoluteUrl(import.meta.env.VITE_APP_FHIR_API_URL, '/fhir/R4');
      const zambdaApiUrl = getAbsoluteUrl(import.meta.env.VITE_APP_PROJECT_API_ZAMBDA_URL, '/local-api');

      const zambdaConfig: ConstructorParameters<typeof Oystehr>[0] = {
        accessToken: token,
        fhirApiUrl,
        projectApiUrl: zambdaApiUrl,
        projectId: import.meta.env.VITE_APP_PROJECT_ID || 'ottehr-brasil',
        retry: {
          retries: 0,
        },
      };
      if (import.meta.env.VITE_APP_IS_LOCAL === 'true') {
        zambdaConfig.services = {
          zambdaApiUrl,
        };
      }
      useApiClientsStore.setState({
        oystehrZambda: new Oystehr(zambdaConfig),
      });
    }
  }, [oystehrZambda, token]);

  return { oystehr, oystehrZambda };
}
