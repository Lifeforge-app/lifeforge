import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import CreatePasswordScreen from '@components/screens/CreatePasswordScreen'
import OTPScreen from '@components/screens/OTPScreen'
import { useAuthContext } from '@providers/AuthProvider'
import { usePasswordContext } from '@providers/PasswordsProvider'
import CreatePasswordModal from './components/CreatePasswordModal'
import PasswordList from './components/PasswordList'
import { fetchChallenge } from './utils/fetchChallenge'
import LockedScreen from '../../components/screens/LockedScreen'

function ModalsSection() {
  const {
    existedData,
    isDeletePasswordConfirmationModalOpen,
    setIsDeletePasswordConfirmationModalOpen,
    refreshPasswordList
  } = usePasswordContext()
  return (
    <>
      <CreatePasswordModal />
      <DeleteConfirmationModal
        apiEndpoint="passwords/password"
        data={existedData}
        isOpen={isDeletePasswordConfirmationModalOpen}
        itemName="password"
        onClose={() => {
          setIsDeletePasswordConfirmationModalOpen(false)
        }}
        updateDataLists={refreshPasswordList}
        customText={`Are you sure you want to delete the password for ${existedData?.name}? This action is irreversible.`}
      />
    </>
  )
}

function Passwords(): React.ReactElement {
  const { t } = useTranslation('modules.passwords')
  const { userData } = useAuthContext()
  const {
    masterPassword,
    setMasterPassword,
    query,
    setQuery,
    otpSuccess,
    setOtpSuccess,
    setModifyPasswordModalOpenType
  } = usePasswordContext()

  function renderContent() {
    if (!otpSuccess) {
      return (
        <OTPScreen
          verificationEndpoint="passwords/master/otp"
          callback={() => setOtpSuccess(true)}
          fetchChallenge={() => {
            return fetchChallenge('master')
          }}
        />
      )
    }

    if (masterPassword === '') {
      return (
        <LockedScreen
          module="vault"
          endpoint="passwords/master/verify"
          setMasterPassword={setMasterPassword}
          fetchChallenge={() => {
            return fetchChallenge('master')
          }}
        />
      )
    }

    if (userData?.hasMasterPassword === false) {
      return (
        <CreatePasswordScreen
          endpoint="passwords/master"
          keyInUserData="hasMasterPassword"
        />
      )
    }

    return (
      <>
        <SearchInput
          stuffToSearch="password"
          searchQuery={query}
          setSearchQuery={setQuery}
          namespace="modules.passwords"
        />
        <PasswordList />
        {masterPassword !== '' && (
          <FAB
            onClick={() => {
              setModifyPasswordModalOpenType('create')
            }}
            hideWhen="lg"
          />
        )}
      </>
    )
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:key"
        title="Passwords"
        actionButton={
          otpSuccess &&
          masterPassword !== '' && (
            <Button
              onClick={() => {
                setModifyPasswordModalOpenType('create')
              }}
              icon="tabler:plus"
              className="hidden lg:flex "
              tProps={{ item: t('items.password') }}
            >
              new
            </Button>
          )
        }
      />
      {renderContent()}
      <ModalsSection />
    </ModuleWrapper>
  )
}

export default Passwords
