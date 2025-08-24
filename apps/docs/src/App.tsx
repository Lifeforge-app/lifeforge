import { RouterProvider, createBrowserRouter } from 'react-router'

import Layout from './components/Layout'
import ROUTES from './routes/Router'

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
