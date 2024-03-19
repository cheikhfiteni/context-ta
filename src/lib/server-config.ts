// NODE_ENV/VERCEL_ENV is set to 'production' when running in a production Vercel environment
const apiServerUrl = import.meta.env.NODE_ENV === 'production'
  ? import.meta.env.PRODUCTION_API_URL
  : import.meta.env.DEVELOPMENT_API_URL || 'http://localhost:3000';

const webSocketServerUrl = import.meta.env.NODE_ENV === 'production'
    ? import.meta.env.PRODUCTION_WS_URL
    : import.meta.env.DEVELOPMENT_WS_URL || 'ws://localhost:3000';

const webClientUrl = import.meta.env.NODE_ENV === 'production'
    ? import.meta.env.PRODUCTION_CLIENT_URL
    : import.meta.env.DEVELOPMENT_CLIENT_URL || 'http://localhost:5173';

export { apiServerUrl, webSocketServerUrl, webClientUrl };