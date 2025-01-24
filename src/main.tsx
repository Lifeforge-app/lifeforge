/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ReactDOM from 'react-dom/client'
import './i18n'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-medium-image-zoom/dist/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-grid-layout/css/styles.css'
import './styles/react-resizable.css'
import 'leaflet/dist/leaflet.css'
import 'react-virtualized/styles.css'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <main
      id="app"
      className="flex h-dvh w-full overflow-x-hidden bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50"
    >
      <App />
    </main>
  </BrowserRouter>
)
