import { useAuth } from '@providers/AuthProvider'
import forgeAPI from '@utils/forgeAPI'
import { ModuleWrapper, WithMasterPassword } from 'lifeforge-ui'

import ContentContainer from './components/ContentContainer'

function APIKeys() {
  const { userData } = useAuth()

  return (
    <ModuleWrapper>
      <WithMasterPassword
        controllers={{
          createPassword: forgeAPI.apiKeys.auth.createOrUpdate,
          getChallenge: forgeAPI.apiKeys.auth.getChallenge,
          verifyPassword: forgeAPI.apiKeys.auth.verify
        }}
        hasMasterPassword={!!userData?.hasAPIKeysMasterPassword}
      >
        {masterPassword => <ContentContainer masterPassword={masterPassword} />}
      </WithMasterPassword>
    </ModuleWrapper>
  )
}

export default APIKeys
