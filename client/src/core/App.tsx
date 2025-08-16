import Providers from '@providers/index'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'dayjs/locale/my'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import duration from 'dayjs/plugin/duration'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { ErrorScreen } from 'lifeforge-ui'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router'

import './i18n'
import './index.css'
import AppRouter from './routes'

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
    <ErrorBoundary
      fallback={<ErrorScreen message="An unexpected error occurred." />}
    >
      <BrowserRouter>
        <main
          className="bg-bg-200/50 dark:bg-bg-900/50 text-bg-800 dark:text-bg-50 flex h-dvh w-full overflow-hidden"
          id="app"
        >
          <Providers>
            <AppRouter />
          </Providers>
        </main>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
