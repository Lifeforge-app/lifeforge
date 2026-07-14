import React, { useState } from 'react'

import type { ForgeEndpoint } from '@lifeforge/api'

import { CreatePasswordScreen } from './components/CreatePasswordScreen'
import { LockedScreen } from './components/LockedScreen'

export function WithMasterPassword<TCreationOutput>({
  controllers,
  hasMasterPassword,
  onCreate,
  onRecoveryRequested,
  children
}: {
  controllers: {
    createPassword: ForgeEndpoint<{
      __isForgeContract: true
      __output: TCreationOutput
    }>
    getChallenge: ForgeEndpoint
    verifyPassword: ForgeEndpoint
  }
  hasMasterPassword: boolean
  onCreate?: (data: TCreationOutput) => void
  onRecoveryRequested?: () => void
  children: (masterPassword: string) => React.ReactNode
}) {
  const [masterPassword, setMasterPassword] = useState('')

  if (!hasMasterPassword) {
    return (
      <CreatePasswordScreen
        challengeController={controllers.getChallenge}
        controller={controllers.createPassword}
        onCreate={onCreate}
      />
    )
  }

  if (masterPassword === '') {
    return (
      <LockedScreen
        challengeController={controllers.getChallenge}
        setMasterPassword={setMasterPassword}
        verifyController={controllers.verifyPassword}
        onRecoveryRequested={onRecoveryRequested}
      />
    )
  }

  return children(masterPassword)
}
