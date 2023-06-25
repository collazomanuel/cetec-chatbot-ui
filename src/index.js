import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="254003460922-0o6c7ejs39uhjdp76kcgk1uldgui7sfh.apps.googleusercontent.com">
    <React.StrictMode>
      <App />    
    </React.StrictMode>
  </GoogleOAuthProvider>
);
