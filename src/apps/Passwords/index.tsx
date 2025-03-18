import { useAuth } from '@providers/AuthProvider'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DeleteConfirmationModal,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  SearchInput
} from '@lifeforge/ui'

import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import ModifyPasswordModal from './components/ModifyPasswordModal'
import PasswordList from './components/PasswordList'

function ModalsSection() {
  const {
    existedData,
    isDeletePasswordConfirmationModalOpen,
    setIsDeletePasswordConfirmationModalOpen
  } = usePasswordContext()
  return (
    <>
      <ModifyPasswordModal />
      <DeleteConfirmationModal
        apiEndpoint="passwords/password"
        customText={`Are you sure you want to delete the password for ${existedData?.name}? This action is irreversible.`}
        data={existedData}
        isOpen={isDeletePasswordConfirmationModalOpen}
        itemName="password"
        queryKey={['passwords', 'entries']}
        onClose={() => {
          setIsDeletePasswordConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

function Passwords() {
  const { t } = useTranslation('apps.passwords')
  const { userData } = useAuth()
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
          namespace="apps.passwords"
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
