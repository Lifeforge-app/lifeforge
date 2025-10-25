import forgeAPI from '@/utils/forgeAPI'
import { WithMasterPassword, WithOTP } from 'lifeforge-ui'
import { useAuth } from 'shared'

import ContentContainer from './components/ContentContainer'

function APIKeys() {
  const { userData } = useAuth()

  return (
    <>
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
    </>
  )
}

export default APIKeys
