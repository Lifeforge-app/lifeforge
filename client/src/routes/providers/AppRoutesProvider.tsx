import { RouterProvider } from 'react-router'

import { useAppRouter } from '../hooks/useAppRouter'

function AppRoutesProvider() {
  const { router } = useAppRouter()

  return <RouterProvider router={router} />
}

export default AppRoutesProvider
