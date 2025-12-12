import ReactDOM from 'react-dom/client'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  createForgeAPIClient
} from 'shared'

import App from './App'
import './index.css'

const forgeAPI = createForgeAPIClient()

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
      <App />
    </PersonalizationProvider>
  </APIEndpointProvider>
)
