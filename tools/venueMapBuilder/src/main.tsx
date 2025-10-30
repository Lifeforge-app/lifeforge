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
import AmenitiesProvider from './providers/AmenitiesProvider'
import ControlKeyEventProvider from './providers/ControlKeyStateProvider'
import DrawingProvider from './providers/DrawingProvider'
import FloorProvider from './providers/FloorsProvider'
import SettingsProvider from './providers/SettingsProvider'
import UnitDataProvider from './providers/UnitDataProvider'

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
            <FloorProvider>
              <DrawingProvider>
                <AmenitiesProvider>
                  <UnitDataProvider>
                    <SettingsProvider>
                      <App />
                      <ModalManager />
                    </SettingsProvider>
                  </UnitDataProvider>
                </AmenitiesProvider>
              </DrawingProvider>
            </FloorProvider>
          </ControlKeyEventProvider>
        </ToastProvider>
      </PersonalizationProvider>
    </APIEndpointProvider>
  </I18nextProvider>
)
