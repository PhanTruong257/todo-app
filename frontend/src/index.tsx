import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';

const GOOGLE_CLIENT_ID = "696778209081-pam2fj0c2m1ld3sd1em0mm58ers3cbtk.apps.googleusercontent.com"; // Thay thế bằng Client ID của bạn

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

