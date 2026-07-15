import { WithQueryData } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import LoginPage from './pages/LoginPage'
import UserCreationPage from './pages/UserCreationPage'

function Auth() {
  return (
    <WithQueryData contract={forgeAPI.user.exists}>
      {exists => (exists ? <LoginPage /> : <UserCreationPage />)}
    </WithQueryData>
  )
}

export default Auth
