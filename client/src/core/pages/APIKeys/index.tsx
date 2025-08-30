import { useAuth } from '@providers/AuthProvider'
import forgeAPI from '@utils/forgeAPI'
import { ModuleWrapper, WithMasterPassword, WithOTP } from 'lifeforge-ui'

import ContentContainer from './components/ContentContainer'

function APIKeys() {
  const { userData } = useAuth()

  return (
    <ModuleWrapper>
      <WithOTP
        controllers={{
          generateOTP: forgeAPI.user.auth.generateOTP,
          getChallenge: forgeAPI.apiKeys.auth.getChallenge,
          verifyOTP: forgeAPI.apiKeys.auth.verifyOTP
        }}
      >
        <WithMasterPassword
          controllers={{
            createPassword: forgeAPI.apiKeys.auth.createOrUpdate,
            getChallenge: forgeAPI.apiKeys.auth.getChallenge,
            verifyPassword: forgeAPI.apiKeys.auth.verify
          }}
          hasMasterPassword={!!userData?.hasAPIKeysMasterPassword}
        >
          {masterPassword => (
            <ContentContainer masterPassword={masterPassword} />
          )}
        </WithMasterPassword>
      </WithOTP>
    </ModuleWrapper>
  )
}

export default APIKeys
