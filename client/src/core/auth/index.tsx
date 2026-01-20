import { WithQueryData } from 'lifeforge-ui'

import forgeAPI from '@/forgeAPI'

import LoginPage from './pages/LoginPage'
import UserCreationPage from './pages/UserCreationPage'

function Auth() {
  return (
    <WithQueryData controller={forgeAPI.untyped('user/exists')}>
      {exists => (exists ? <LoginPage /> : <UserCreationPage />)}
    </WithQueryData>
  )
}

export default Auth
