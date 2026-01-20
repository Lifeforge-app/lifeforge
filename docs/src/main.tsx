import ReactDOM from 'react-dom/client'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  createForgeProxy
} from 'shared'

import ModalProvider from 'shared/dist/providers/ModalStoreProvider'

import App from './App'
import './index.css'

const forgeAPI = createForgeProxy()

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
