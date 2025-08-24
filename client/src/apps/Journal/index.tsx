import { useAuth } from '@providers/AuthProvider'
import forgeAPI from '@utils/forgeAPI'
import { ModuleWrapper, WithMasterPassword, WithOTP } from 'lifeforge-ui'

import ContentContainer from './components/ContentContainer'

function Journal() {
  const { userData } = useAuth()

  return (
    <ModuleWrapper>
      <WithOTP
        controllers={{
          generateOTP: forgeAPI.user.auth.generateOTP,
          getChallenge: forgeAPI.journal.auth.getChallenge,
          verifyOTP: forgeAPI.journal.auth.validateOTP
        }}
      >
        <WithMasterPassword
          controllers={{
            getChallenge: forgeAPI.journal.auth.getChallenge,
            verifyPassword: forgeAPI.journal.auth.verify,
            createPassword: forgeAPI.journal.auth.create
          }}
          hasMasterPassword={!!userData?.hasJournalMasterPassword}
        >
          {masterPassword => (
            <ContentContainer masterPassword={masterPassword} />
          )}
        </WithMasterPassword>
      </WithOTP>
    </ModuleWrapper>
  )
}

export default Journal
