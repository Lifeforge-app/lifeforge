import { ModalManager } from 'lifeforge-ui'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  ToastProvider
} from 'shared'

import App from './App'
import i18n from './i18n'
import './index.css'
import ControlKeyEventProvider from './providers/ControlKeyStateProvider'
import DrawingProvider from './providers/DrawingProvider'
import FloorProvider from './providers/FloorsProvider'
import SettingsProvider from './providers/SettingsProvider'

createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <APIEndpointProvider endpoint={import.meta.env.VITE_API_ENDPOINT}>
      <PersonalizationProvider
        defaultValueOverride={{
          rawThemeColor: 'theme-lime',
          language: 'en'
        }}
      >
        <ToastProvider>
          <ControlKeyEventProvider>
            <DrawingProvider>
              <FloorProvider>
                <SettingsProvider>
                  <App />
                </SettingsProvider>
              </FloorProvider>
            </DrawingProvider>
          </ControlKeyEventProvider>
          <ModalManager />
        </ToastProvider>
      </PersonalizationProvider>
    </APIEndpointProvider>
  </I18nextProvider>
)
