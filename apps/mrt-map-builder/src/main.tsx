import { ModalManager } from 'lifeforge-ui'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  ToastProvider
} from 'shared'

import App from './App.tsx'
import i18n from './i18n'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <APIEndpointProvider endpoint={import.meta.env.VITE_API_ENDPOINT}>
        <PersonalizationProvider
          defaultValueOverride={{
            rawThemeColor: 'theme-lime',
            language: 'en'
          }}
        >
          <ToastProvider>
            <App />
            <ModalManager />
          </ToastProvider>
        </PersonalizationProvider>
      </APIEndpointProvider>
    </I18nextProvider>
  </StrictMode>
)
