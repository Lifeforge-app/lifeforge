import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import {
  APIEndpointProvider,
  PersonalizationProvider,
  ToastProvider
} from 'shared'

import App from './App.tsx'
import i18n from './i18n'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <APIEndpointProvider endpoint={import.meta.env.VITE_API_HOST}>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <PersonalizationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PersonalizationProvider>
      </I18nextProvider>
    </QueryClientProvider>
  </APIEndpointProvider>
)
