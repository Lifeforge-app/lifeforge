import ReactDOM from 'react-dom/client'

import {
  APIEndpointProvider,
  type CoreContract,
  createForgeProxy
} from '@lifeforge/api'
import { ModalProvider, PersonalizationProvider } from '@lifeforge/ui'

import App from './App'
import './index.css'

const forgeAPI = createForgeProxy<CoreContract>()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <APIEndpointProvider endpoint={import.meta.env.VITE_API_URL}>
    <PersonalizationProvider
      defaultValueOverride={{
        rawThemeColor: '#a9d066',
        theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'system',
        fontScale: 1.1
      }}
      forgeAPI={forgeAPI}
    >
      <ModalProvider>
        <App />
      </ModalProvider>
    </PersonalizationProvider>
  </APIEndpointProvider>
)
