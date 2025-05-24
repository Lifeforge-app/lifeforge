import Providers from '@providers/index.tsx'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router'

import './index.css'

import './i18n'
import AppRouter from './routes/index.tsx'

dayjs.extend(duration)
dayjs.extend(isBetween)
dayjs.extend(relativeTime)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(weekOfYear)
dayjs.extend(customParseFormat)

function App() {
  useEffect(() => {
    const preloader = document.querySelector('.preloader')
    if (preloader) {
      preloader.remove()
    }
  }, [])

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
