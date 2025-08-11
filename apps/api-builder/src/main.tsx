import { type SSOAppConfig, SSOAppMainView } from 'lifeforge-ui'
import ReactDOM from 'react-dom/client'

import FlowEditorWrapper from './components/FlowEditor/index.tsx'
import './index.css'
import forgeAPI from './utils/forgeAPI.tsx'

const config = {
  apiEndpoint: import.meta.env.VITE_API_HOST,
  forgeAPI,
  namespace: 'core.apiBuilder',
  icon: 'tabler:crane',
  link: 'https://github.com/Lifeforge-app/lifeforge/tree/main/apps/api-builder',
  frontendURL: import.meta.env.VITE_FRONTEND_URL
} satisfies SSOAppConfig

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SSOAppMainView config={config}>
    <FlowEditorWrapper />
  </SSOAppMainView>
)
