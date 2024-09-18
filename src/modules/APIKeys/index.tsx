import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import CreatePasswordScreen from '@components/Screens/CreatePasswordScreen'
import LockedScreen from '@components/Screens/LockedScreen'
import OTPScreen from '@components/Screens/OTPScreen'
import { type APIKeyEntry } from '@interfaces/api_keys_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import EntryItem from './components/EntryItem'
import ModifyAPIKeyModal from './components/ModifyAPIKeyModal'
import { fetchChallenge } from './utils/fetchChallenge'

function APIKeys(): React.ReactElement {
  const { userData } = useAuthContext()
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [existingData, setExistingData] = useState<APIKeyEntry | null>(null)
  const [modifyAPIKeyModalOpenType, setModifyAPIKeyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)
  const [entries, setEntries] = useState<'loading' | 'error' | APIKeyEntry[]>(
    'loading'
  )

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

  return (
    <ModuleWrapper>
      <div className="flex-between flex">
        <ModuleHeader
          icon="tabler:password"
          title="API Keys"
          desc="..."
          actionButton={
            otpSuccess &&
            masterPassword !== '' && (
              <Button
                icon="tabler:plus"
                className="hidden lg:flex"
                onClick={() => {
                  setModifyAPIKeyModalOpenType('create')
                }}
              >
                add API key
              </Button>
            )
          }
        />
      </div>
      {otpSuccess ? (
        userData?.hasAPIKeysMasterPassword === false ? (
          <CreatePasswordScreen
            endpoint="api-keys/auth"
            keyInUserData="hasAPIKeysMasterPassword"
          />
        ) : masterPassword === '' ? (
          <LockedScreen
            module="API Keys"
            endpoint="api-keys/auth/verify"
            setMasterPassword={setMasterPassword}
            fetchChallenge={fetchChallenge}
          />
        ) : (
          <>
            <div className="mt-8 flex-1">
              <APIComponentWithFallback data={entries}>
                {entries => (
                  <>
                    {entries.map((entry, idx) => (
                      <EntryItem
                        key={entry.id}
                        entry={entry}
                        hasDivider={idx !== entries.length - 1}
                        setExistingData={setExistingData}
                        setModifyAPIKeyModalOpenType={
                          setModifyAPIKeyModalOpenType
                        }
                        setDeleteConfirmationModalOpen={
                          setDeleteConfirmationModalOpen
                        }
                      />
                    ))}
                  </>
                )}
              </APIComponentWithFallback>
            </div>
            <ModifyAPIKeyModal
              openType={modifyAPIKeyModalOpenType}
              masterPassword={masterPassword}
              existingData={existingData}
              onClose={() => {
                setModifyAPIKeyModalOpenType(null)
                fetchData().catch(console.error)
              }}
            />
            <DeleteConfirmationModal
              isOpen={deleteConfirmationModalOpen}
              onClose={() => {
                setDeleteConfirmationModalOpen(false)
              }}
              apiEndpoint="api-keys"
              data={existingData}
              itemName="API Key"
              nameKey="name"
              updateDataList={() => {
                fetchData().catch(console.error)
              }}
            />
          </>
        )
      ) : (
        <OTPScreen
          verificationEndpoint="api-keys/auth/otp"
          callback={() => {
            setOtpSuccess(true)
          }}
          fetchChallenge={fetchChallenge}
        />
      )}
    </ModuleWrapper>
  )
}

export default APIKeys
