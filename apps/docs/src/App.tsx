import { RouterProvider, createBrowserRouter } from 'react-router'

import ROUTES from './Router'
import Layout from './components/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: ROUTES
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
