import { useAuth0 } from '@auth0/auth0-react';
import { FC, ReactElement } from 'react';
import { LoadingScreen } from '../LoadingScreen';

interface ProtectedRouteProps {
  showWhenAuthenticated: ReactElement;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = (props: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (import.meta.env.VITE_APP_IS_LOCAL === 'true') {
    return props.showWhenAuthenticated;
  }

  if (!isAuthenticated && isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated && !isLoading) {
    loginWithRedirect().catch((error) => {
      throw new Error(`Error calling loginWithRedirect Auth0 ${error}`);
    });
  }

  return props.showWhenAuthenticated;
};
