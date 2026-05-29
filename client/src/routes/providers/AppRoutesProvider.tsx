import { RouterProvider } from '@lifeforge/shared'

import { useAppRouter } from '../hooks/useAppRouter'

function AppRoutesProvider() {
  const { router, routerKey } = useAppRouter()

  return <RouterProvider key={routerKey} router={router} />
}

export default AppRoutesProvider
