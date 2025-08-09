import { SSOAppConfig, SSOAppMainView } from 'lifeforge-ui'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './i18n'
import './index.css'
import LocaleManagerProvider from './providers/LocaleManagerProvider.tsx'
import forgeAPI from './utils/forgeAPI.tsx'

const config = {
  apiEndpoint: import.meta.env.VITE_API_HOST,
  forgeAPI,
  namespace: 'core.localizationManager',
  icon: 'mingcute:translate-line',
  link: 'https://github.com/Lifeforge-app/lifeforge/tree/main/apps/localization-manager',
  frontendURL: import.meta.env.VITE_FRONTEND_URL
} satisfies SSOAppConfig

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SSOAppMainView config={config}>
    <LocaleManagerProvider>
      <App />
    </LocaleManagerProvider>
  </SSOAppMainView>
)
