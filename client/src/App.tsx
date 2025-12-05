import { ErrorScreen } from 'lifeforge-ui'
import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { type InferOutput } from 'shared'

import './i18n'
import './index.css'
import Providers from './providers'
import './utils/extendDayJs'
import forgeAPI from './utils/forgeAPI'

export type UserData = InferOutput<typeof forgeAPI.user.auth.getUserData>

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
      <main
        className="bg-bg-200/50 dark:bg-bg-900/50 text-bg-800 dark:text-bg-50 flex h-dvh w-full overflow-hidden"
        id="app"
      >
        <Providers />
      </main>
    </ErrorBoundary>
  )
}

export default App
