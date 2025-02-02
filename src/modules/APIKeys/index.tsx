import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import CreatePasswordScreen from '@components/screens/CreatePasswordScreen'
import LockedScreen from '@components/screens/LockedScreen'
import OTPScreen from '@components/screens/OTPScreen'
import { type IAPIKeyEntry } from '@interfaces/api_keys_interfaces'
import { Loadable } from '@interfaces/common'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import EntryItem from './components/EntryItem'
import ModifyAPIKeyModal from './components/ModifyAPIKeyModal'
import { fetchChallenge } from './utils/fetchChallenge'

function APIKeys(): React.ReactElement {
  const { t } = useTranslation('modules.apiKeys')
  const { userData } = useAuthContext()
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [existingData, setExistingData] = useState<IAPIKeyEntry | null>(null)
  const [modifyAPIKeyModalOpenType, setModifyAPIKeyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)
  const [entries, setEntries] = useState<Loadable<IAPIKeyEntry[]>>('loading')

  async function fetchData(): Promise<void> {
    setEntries('loading')

    const challenge = await fetchChallenge()

    await APIRequest({
      endpoint: `api-keys?master=${encodeURIComponent(
        encrypt(masterPassword, challenge)
      )}`,
      method: 'GET',
      callback(data) {
        setEntries(data.data)
      },
      onFailure: () => {
        toast.error(t('fetch.fetchError'))
        setEntries('error')
      }
    })
  }

  useEffect(() => {
    if (masterPassword !== '') {
      fetchData().catch(console.error)
    }
  }, [masterPassword])

  const renderContent = () => {
    if (!otpSuccess) {
      return (
        <OTPScreen
          callback={() => {
            setOtpSuccess(true)
          }}
          fetchChallenge={fetchChallenge}
          verificationEndpoint="api-keys/auth/otp"
        />
      )
    }

    if (userData?.hasAPIKeysMasterPassword === false) {
      return (
        <CreatePasswordScreen
          endpoint="api-keys/auth"
          keyInUserData="hasAPIKeysMasterPassword"
        />
      )
    }

    if (masterPassword === '') {
      return (
        <LockedScreen
          endpoint="api-keys/auth/verify"
          fetchChallenge={fetchChallenge}
          setMasterPassword={setMasterPassword}
        />
      )
    }

    return (
      <>
        <div className="mt-6 flex-1">
          <APIFallbackComponent data={entries}>
            {entries => (
              <>
                {entries.map((entry, idx) => (
                  <EntryItem
                    key={entry.id}
                    entry={entry}
                    hasDivider={idx !== entries.length - 1}
                    setDeleteConfirmationModalOpen={
                      setDeleteConfirmationModalOpen
                    }
                    setExistingData={setExistingData}
                    setModifyAPIKeyModalOpenType={setModifyAPIKeyModalOpenType}
                  />
                ))}
              </>
            )}
          </APIFallbackComponent>
        </div>
        <ModifyAPIKeyModal
          existingData={existingData}
          masterPassword={masterPassword}
          openType={modifyAPIKeyModalOpenType}
          onClose={() => {
            setModifyAPIKeyModalOpenType(null)
            fetchData().catch(console.error)
          }}
        />
        <DeleteConfirmationModal
          apiEndpoint="api-keys"
          data={existingData}
          isOpen={deleteConfirmationModalOpen}
          itemName="API Key"
          nameKey="name"
          updateDataLists={() => {
            fetchData().catch(console.error)
          }}
          onClose={() => {
            setDeleteConfirmationModalOpen(false)
          }}
        />
      </>
    )
  }

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader
          actionButton={
            otpSuccess &&
            masterPassword !== '' && (
              <Button
                className="hidden lg:flex"
                icon="tabler:plus"
                tProps={{
                  item: t('items.apiKey')
                }}
                onClick={() => {
                  setModifyAPIKeyModalOpenType('create')
                }}
              >
                new
              </Button>
            )
          }
          icon="tabler:password"
          title="API Keys"
        />
      </div>
      {renderContent()}
    </ModuleWrapper>
  )
}

export default APIKeys
