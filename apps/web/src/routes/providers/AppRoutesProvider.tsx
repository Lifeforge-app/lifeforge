import { RouterProvider } from 'react-router'

import { useAppRouter } from '../hooks/useAppRouter'

function AppRoutesProvider() {
  const { router, routerKey } = useAppRouter()

  return <RouterProvider key={routerKey} router={router} />
}

export default AppRoutesProvider
