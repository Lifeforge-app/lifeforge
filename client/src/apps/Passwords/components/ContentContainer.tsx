import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'
import forgeAPI from '@utils/forgeAPI'
import { FAB, SearchInput } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import { useAuth } from '../../../core/providers/AuthProvider'
import ModifyPasswordModal from '../modals/ModifyPasswordModal'
import { usePasswordContext } from '../providers/PasswordsProvider'
import PasswordList from './PasswordList'

function ContentContainer() {
  const open = useModalStore(state => state.open)

  const { userData } = useAuth()

  const {
    masterPassword,
    setMasterPassword,
    query,
    setQuery,
    otpSuccess,
    setOtpSuccess
  } = usePasswordContext()

  const handleCreatePassword = useCallback(() => {
    open(ModifyPasswordModal, {
      type: 'create'
    })
  }, [])

  if (!otpSuccess) {
    return (
      <OTPScreen
        callback={() => setOtpSuccess(true)}
        challengeController={forgeAPI.passwords.master.getChallenge}
        verifyController={forgeAPI.passwords.master.validateOTP}
      />
    )
  }

  if (masterPassword === '') {
    return (
      <LockedScreen
        challengeController={forgeAPI.passwords.master.getChallenge}
        setMasterPassword={setMasterPassword}
        verifyController={forgeAPI.passwords.master.verify}
      />
    )
  }

  if (userData?.hasMasterPassword === false) {
    return (
      <CreatePasswordScreen controller={forgeAPI.passwords.master.create} />
    )
  }

  return (
    <>
      <SearchInput
        namespace="apps.passwords"
        searchQuery={query}
        setSearchQuery={setQuery}
        stuffToSearch="password"
      />
      <PasswordList />
      {masterPassword !== '' && (
        <FAB hideWhen="lg" onClick={handleCreatePassword} />
      )}
    </>
  )
}

export default ContentContainer
