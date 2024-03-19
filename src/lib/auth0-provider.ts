import { webClientUrl } from './server-config';

interface AuthConfig {
    clientID: string;
    domain: string;
    callbackURL: string;
    audience: string;
  }
  
  export const AUTH_CONFIG: AuthConfig = {
    clientID: 'hSg0chIGQBzytMEDaAzJZExzmV3sHE4L',
    domain: 'dev-p6hlgqoghxy53wn2.us.auth0.com',
    // callbackURL is the same as redirect_uri, can be route
    callbackURL: `${webClientUrl}/callback`,
    // apiUrl is the audience, it's not even fulled used to call the API
    // more so used as the corresponding API identifer. Unclear how access token handled though
    audience: 'https://context-ta-auth0-test-api/'
  };