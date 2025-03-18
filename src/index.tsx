import ReactDOM from 'react-dom/client'

import App from './core/App'

window.VITE_API_HOST = import.meta.env.VITE_API_HOST
window.VITE_LOCALIZATION_MANAGER_URL =
  import.meta.env.VITE_LOCALIZATION_MANAGER_URL

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
