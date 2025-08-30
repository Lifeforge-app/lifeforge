import { useAuth } from '@providers/AuthProvider'
import forgeAPI from '@utils/forgeAPI'
import { ModuleWrapper, WithMasterPassword, WithOTP } from 'lifeforge-ui'
import type { InferOutput } from 'shared'

import ContentContainer from './components/ContentContainer'

export type PasswordEntry = InferOutput<
  typeof forgeAPI.passwords.entries.list
>[number]

function Passwords() {
  const { userData } = useAuth()

  return (
    <ModuleWrapper>
      <WithOTP
        controllers={{
          getChallenge: forgeAPI.passwords.master.getChallenge,
          verifyOTP: forgeAPI.passwords.master.validateOTP,
          generateOTP: forgeAPI.user.auth.generateOTP
        }}
      >
        <WithMasterPassword
          controllers={{
            createPassword: forgeAPI.passwords.master.create,
            getChallenge: forgeAPI.passwords.master.getChallenge,
            verifyPassword: forgeAPI.passwords.master.verify
          }}
          hasMasterPassword={!!userData?.hasMasterPassword}
        >
          {masterPassword => (
            <ContentContainer masterPassword={masterPassword} />
          )}
        </WithMasterPassword>
      </WithOTP>
    </ModuleWrapper>
  )
}

export default Passwords
