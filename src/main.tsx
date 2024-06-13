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
import 'react-resizable/css/styles.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
