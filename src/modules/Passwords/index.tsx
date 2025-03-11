import { useAuthContext } from '@providers/AuthProvider'
import { usePasswordContext } from '@providers/PasswordsProvider'
import React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  CreatePasswordScreen,
  DeleteConfirmationModal,
  FAB,
  LockedScreen,
  OTPScreen,
  SearchInput
} from '@lifeforge/ui'

import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'

import CreatePasswordModal from './components/CreatePasswordModal'
import PasswordList from './components/PasswordList'

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
        customText={`Are you sure you want to delete the password for ${existedData?.name}? This action is irreversible.`}
        data={existedData}
        isOpen={isDeletePasswordConfirmationModalOpen}
        itemName="password"
        updateDataList={refreshPasswordList}
        onClose={() => {
          setIsDeletePasswordConfirmationModalOpen(false)
        }}
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
          namespace="modules.passwords"
          searchQuery={query}
          setSearchQuery={setQuery}
          stuffToSearch="password"
        />
        <PasswordList />
        {masterPassword !== '' && (
          <FAB
            hideWhen="lg"
            onClick={() => {
              setModifyPasswordModalOpenType('create')
            }}
          />
        )}
      </>
    )
  }

  return (
    <ModuleWrapper>
      <ModuleHeader
        actionButton={
          otpSuccess &&
          masterPassword !== '' && (
            <Button
              className="hidden lg:flex"
              icon="tabler:plus"
              tProps={{ item: t('items.password') }}
              onClick={() => {
                setModifyPasswordModalOpenType('create')
              }}
            >
              new
            </Button>
          )
        }
        icon="tabler:key"
        title="Passwords"
      />
      {renderContent()}
      <ModalsSection />
    </ModuleWrapper>
  )
}

export default Passwords
