import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  createForgeProxy
} from 'shared'

import App from './App.tsx'
import './index.css'

const forgeAPI = createForgeProxy()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <APIEndpointProvider
      endpoint={import.meta.env.VITE_API_URL || 'http://localhost:3000'}
    >
      <PersonalizationProvider
        defaultValueOverride={{
          rawThemeColor: '#a9d066',
          theme:
            (localStorage.getItem('theme') as 'light' | 'dark') || 'system',
          fontScale: 1.1
        }}
        forgeAPI={forgeAPI}
      >
        <App />
      </PersonalizationProvider>
    </APIEndpointProvider>
  </StrictMode>
)
