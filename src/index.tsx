import React from 'react'
import App from './App.tsx'
import './style/index.css'

import { Auth0Provider } from "@auth0/auth0-react";
import { AUTH_CONFIG } from "./lib/auth0-provider";
import history from "./lib/history.ts";
import { createRoot } from "react-dom/client";

interface AppState {
    returnTo?: string;
    [key: string]: any; // This allows for any number of additional properties with any type
}

const onRedirectCallback = (appState?: AppState) => {
    history.push(
        appState?.returnTo ?? window.location.pathname
    );
  };

const container = document.getElementById("root");
const root = createRoot(container!);

const providerConfig = {
    domain: AUTH_CONFIG.domain,
    clientId: AUTH_CONFIG.clientID,
    onRedirectCallback,
    authorizationParams: {
      redirect_uri: window.location.origin,
      ...(AUTH_CONFIG.audience ? { audience: AUTH_CONFIG.audience } : null),
    },
  };


root.render(
<React.StrictMode>
    <Auth0Provider
        {...providerConfig}
        >
        <App />
    </Auth0Provider>
</React.StrictMode>
);
