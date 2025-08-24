import ReactDOM from 'react-dom/client'
import { APIEndpointProvider, PersonalizationProvider } from 'shared'

import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <APIEndpointProvider endpoint={import.meta.env.VITE_API_URL}>
    <PersonalizationProvider
      defaultValueOverride={{
        rawThemeColor: '#a9d066',
        theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'system'
      }}
    >
      <App />
    </PersonalizationProvider>
  </APIEndpointProvider>
)
