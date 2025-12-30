import React, { useState } from 'react'
import type { ForgeAPIClientController } from 'shared'

import CreatePasswordScreen from './components/CreatePasswordScreen'
import LockedScreen from './components/LockedScreen'

function WithMasterPassword({
  controllers,
  hasMasterPassword,
  children
}: {
  controllers: {
    createPassword: ForgeAPIClientController
    getChallenge: ForgeAPIClientController
    verifyPassword: ForgeAPIClientController
  }
  hasMasterPassword: boolean
  children: (masterPassword: string) => React.ReactNode
}) {
  const [masterPassword, setMasterPassword] = useState('')

  if (!hasMasterPassword) {
    return (
      <CreatePasswordScreen
        challengeController={controllers.getChallenge}
        controller={controllers.createPassword}
      />
    )
  }

  if (masterPassword === '') {
    return (
      <LockedScreen
        challengeController={controllers.getChallenge}
        setMasterPassword={setMasterPassword}
        verifyController={controllers.verifyPassword}
      />
    )
  }

  return children(masterPassword)
}

export default WithMasterPassword
