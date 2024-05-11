/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ReactDOM from 'react-dom/client'
import './i18n'
import App from './App'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-medium-image-zoom/dist/styles.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
