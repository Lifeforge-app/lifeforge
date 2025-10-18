import { NotFoundScreen } from 'lifeforge-ui'
import { useEffect } from 'react'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router'

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
          <div className="flex-center flex-1">
            <NotFoundScreen
              description="Seems like the page you are looking for does not exist."
              title="Oops! Page Not Found"
            />
          </div>
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

  return <RouterProvider router={router} />
}

export default App
