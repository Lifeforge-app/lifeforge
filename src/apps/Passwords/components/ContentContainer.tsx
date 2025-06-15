import { useCallback } from 'react'

import { FAB, SearchInput } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'

import { useAuth } from '../../../core/providers/AuthProvider'
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
    open('passwords.modifyPassword', {
      type: 'create',
      existedData: null
    })
  }, [])

  if (!otpSuccess) {
    return (
      <OTPScreen
        callback={() => setOtpSuccess(true)}
        endpoint="passwords/master"
      />
    )
  }

  if (masterPassword === '') {
    return (
      <LockedScreen
        endpoint="passwords/master"
        setMasterPassword={setMasterPassword}
      />
    )
  }

  if (userData?.hasMasterPassword === false) {
    return <CreatePasswordScreen endpoint="passwords/master" />
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
