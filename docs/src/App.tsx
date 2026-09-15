import { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'

import { ErrorScreen, Flex, NotFoundScreen } from '@lifeforge/ui'

import ROUTES from './Router'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: ROUTES.concat([
      {
        path: '/',
        element: <Navigate replace to="/getting-started/introduction" />
      },
      {
        path: '*',
        element: (
          <Flex centered flex="1">
            <NotFoundScreen
              message="Seems like the page you are looking for does not exist."
              title="Oops! Page Not Found"
            />
          </Flex>
        )
      }
    ])
  }
])

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
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
