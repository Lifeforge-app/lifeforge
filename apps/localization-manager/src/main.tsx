import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { APIEndpointProvider, PersonalizationProvider } from 'shared/lib'

import './index.css'

import App from './App.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <APIEndpointProvider endpoint={import.meta.env.VITE_API_HOST}>
    <QueryClientProvider client={queryClient}>
      <PersonalizationProvider>
        <App />
      </PersonalizationProvider>
    </QueryClientProvider>
  </APIEndpointProvider>
)
