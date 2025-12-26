import forgeAPI from '@/utils/forgeAPI'
import { WithQueryData } from 'lifeforge-ui'

import LoginPage from './pages/LoginPage'
import UserCreationPage from './pages/UserCreationPage'

function Auth() {
  return (
    <WithQueryData controller={forgeAPI.user.exists}>
      {exists => (exists ? <LoginPage /> : <UserCreationPage />)}
    </WithQueryData>
  )
}

export default Auth
