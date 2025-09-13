import { SSOAppConfig, SSOAppMainView } from 'lifeforge-ui'
import ReactDOM from 'react-dom/client'

import App from './App'
import './i18n'
import './index.css'
import forgeAPI from './utils/forgeAPI'

const config = {
  apiEndpoint: import.meta.env.VITE_API_HOST,
  forgeAPI,
  namespace: 'apps.localizationManager',
  icon: 'mingcute:translate-line',
  link: 'https://github.com/Lifeforge-app/lifeforge/tree/main/apps/localization-manager',
  frontendURL: import.meta.env.VITE_FRONTEND_URL
} satisfies SSOAppConfig

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SSOAppMainView config={config}>
    <App />
  </SSOAppMainView>
)
