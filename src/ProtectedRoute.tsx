import { withAuthenticationRequired } from '@auth0/auth0-react';
import { RouteProps } from 'react-router-dom';

const ProtectedRoute = ({ children }: RouteProps) => {
  const Component = withAuthenticationRequired(
    () => <>{children}</>,
    {
      // If the user is not authenticated, Auth0 will take care of sending
      // them to the login page and returning them to the app after login
      onRedirecting: () => <div>Loading...</div>,
    }
  );

  return <Component />;
};

export default ProtectedRoute;