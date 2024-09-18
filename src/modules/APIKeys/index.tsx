import { Icon } from '@iconify/react/dist/iconify.js'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
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
                      <ConfigColumn
                        key={entry.id}
                        title={
                          <>
                            {entry.name}
                            <span className="text-sm text-bg-500">
                              ({entry.keyId})
                            </span>
                          </>
                        }
                        desc={entry.description}
                        icon={entry.icon}
                        hasDivider={idx !== entries.length - 1}
                      >
                        <code className="flex items-center gap-1 text-lg">
                          {Array(12)
                            .fill(0)
                            .map((_, i) => (
                              <Icon
                                key={i}
                                icon="tabler:circle-filled"
                                className="size-1"
                              />
                            ))}
                          <span className="ml-0.5">{entry.key}</span>
                        </code>
                        <HamburgerMenu className="relative ml-2">
                          <MenuItem
                            onClick={() => {
                              setExistingData(entry)
                              setModifyAPIKeyModalOpenType('update')
                            }}
                            text="edit"
                            icon="tabler:pencil"
                          />
                          <MenuItem
                            onClick={() => {}}
                            text="delete"
                            icon="tabler:trash"
                            isRed
                          />
                        </HamburgerMenu>
                      </ConfigColumn>
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
