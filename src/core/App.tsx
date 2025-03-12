// App.tsx
import 'leaflet/dist/leaflet.css'
import React from 'react'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import 'react-date-picker/dist/DatePicker.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
import 'react-grid-layout/css/styles.css'
import 'react-medium-image-zoom/dist/styles.css'
import { BrowserRouter } from 'react-router'
import 'react-toastify/dist/ReactToastify.css'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-virtualized/styles.css'

import Providers from './Providers.tsx'
import AppRouter from './Router.tsx'
import './i18n'
import './styles/index.css'
import './styles/react-resizable.css'

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <main
        className="bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex h-dvh w-full overflow-hidden"
        id="app"
      >
        <Providers>
          <AppRouter />
        </Providers>
      </main>
    </BrowserRouter>
  )
}

export default App
