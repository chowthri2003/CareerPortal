import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MsalTokenProvider from './auth/tokenProvider'
import { BrowserRouter } from 'react-router-dom'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from './auth/msalconfig';
import App from './App'
import './index.css'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
      <MsalTokenProvider>
          <Toaster position="top-center" richColors />
          <App />
        </MsalTokenProvider>
      </BrowserRouter>
    </MsalProvider>
  </StrictMode>
)