import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import ModuleDetail from '@/pages/ModuleDetail'
import Registry from '@/pages/Registry'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'registry',
        element: <Registry />
      },
      {
        path: 'module/:id',
        element: <ModuleDetail />
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
