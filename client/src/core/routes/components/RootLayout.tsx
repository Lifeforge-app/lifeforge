import { ErrorScreen } from 'lifeforge-ui'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router'

import useTitleEffect from '../hooks/useTitleEffect'
import Sidebar from './Sidebar/Sidebar'

function RootLayout() {
  useTitleEffect()

  return (
    <>
      <Sidebar />
      <main className="relative flex size-full min-h-0 min-w-0 flex-col overflow-x-hidden pb-0 sm:ml-[5.4rem] lg:ml-0">
        <ErrorBoundary
          fallback={<ErrorScreen message="An unexpected error occurred." />}
        >
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  )
}

export default RootLayout
