import { ErrorBoundary } from 'react-error-boundary'
import { Outlet, useLocation } from 'react-router'

import { ErrorScreen, Flex } from '@lifeforge/ui'

import useTitleEffect from '../hooks/useTitleEffect'
import Sidebar from './Sidebar/Sidebar'

function RootLayout() {
  const location = useLocation()
  useTitleEffect()

  return (
    <>
      <Sidebar />
      <Flex
        direction="column"
        height="100%"
        minHeight="0"
        minWidth="0"
        ml={{
          base: 'none',
          sm: '3xl',
          lg: 'none'
        }}
        overflowX="hidden"
        position="relative"
        width="100%"
      >
        <ErrorBoundary
          key={location.pathname}
          fallback={<ErrorScreen message="An unexpected error occurred." />}
          resetKeys={[location.pathname]}
        >
          <Outlet />
        </ErrorBoundary>
      </Flex>
    </>
  )
}

export default RootLayout
