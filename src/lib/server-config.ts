// Important note is this currently falls back to localhost if either value is falsy.
// NODE_ENV/VERCEL_ENV is set to 'production' when running in a production Vercel environment
const apiServerUrl = import.meta.env.VITE_NODE_ENV === 'production'
  ? import.meta.env.VITE_PRODUCTION_API_URL
  : import.meta.env.VITE_DEVELOPMENT_API_URL || 'http://localhost:3000';

const webSocketServerUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_PRODUCTION_WS_URL
    : import.meta.env.VITE_DEVELOPMENT_WS_URL || 'ws://localhost:3000';

const webClientUrl = import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_PRODUCTION_CLIENT_URL
    : import.meta.env.VITE_DEVELOPMENT_CLIENT_URL || 'http://localhost:5173';

export { apiServerUrl, webSocketServerUrl, webClientUrl };