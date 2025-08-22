import React, { useState } from 'react'

import CreatePasswordScreen from './components/CreatePasswordScreen'
import LockedScreen from './components/LockedScreen'
import type { ForgeAPIClientController } from 'shared'

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
    if (hasMasterPassword === false) {
      return <CreatePasswordScreen controller={controllers.createPassword} />
    }
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

  return <div>{children(masterPassword)}</div>
}

export default WithMasterPassword
