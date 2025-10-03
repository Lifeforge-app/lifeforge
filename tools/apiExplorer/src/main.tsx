import { SSOAppConfig, SSOAppMainView } from 'lifeforge-ui'
import ReactDOM from 'react-dom/client'

import App from './App.js'
import './i18n.js'
import './index.css'
import forgeAPI from './utils/forgeAPI.js'

const config = {
  apiEndpoint: import.meta.env.VITE_API_HOST,
  forgeAPI,
  namespace: 'apps.apiExplorer',
  icon: 'mynaui:api',
  link: 'https://github.com/Lifeforge-app/lifeforge/tree/main/apps/api-explorer',
  frontendURL: import.meta.env.VITE_FRONTEND_URL
} satisfies SSOAppConfig

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SSOAppMainView config={config}>
    <App />
  </SSOAppMainView>
)
