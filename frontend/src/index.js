import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const container = document.getElementById('root');
const root = createRoot(container);

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
if (!clientId) {
  // eslint-disable-next-line no-console
  console.warn('REACT_APP_GOOGLE_CLIENT_ID is not set. Google Login will not function until it is configured.');
}

root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);

// register service worker to receive push when possible
serviceWorkerRegistration.register();
