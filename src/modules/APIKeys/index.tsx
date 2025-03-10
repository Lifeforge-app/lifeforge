import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, FAB } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import CreatePasswordScreen from '@components/screens/CreatePasswordScreen'
import LockedScreen from '@components/screens/LockedScreen'
import OTPScreen from '@components/screens/OTPScreen'
import QueryWrapper from '@components/screens/QueryWrapper'
import useAPIQuery from '@hooks/useAPIQuery'
import { type IAPIKeyEntry } from '@interfaces/api_keys_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'
import EntryItem from './components/EntryItem'
import ModifyAPIKeyModal from './components/ModifyAPIKeyModal'

function APIKeys(): React.ReactElement {
  const { t } = useTranslation('modules.apiKeys')
  const { userData } = useAuthContext()
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [masterPassword, setMasterPassword] = useState<string>('')
  const [existingData, setExistingData] = useState<IAPIKeyEntry | null>(null)
  const { data: challenge } = useAPIQuery<string>('api-keys/auth/challenge', [
    'api-keys',
    'challenge'
  ])
  const entriesQuery = useQuery<IAPIKeyEntry[]>({
    queryKey: ['api-keys', 'entries', masterPassword, challenge],
    queryFn: () =>
      fetchAPI(
        'api-keys?master=' +
          encodeURIComponent(encrypt(masterPassword, challenge!))
      ),
    enabled: !!masterPassword && !!challenge
  })

  const [modifyAPIKeyModalOpenType, setModifyAPIKeyModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)

  const renderContent = () => {
    if (!otpSuccess) {
      return (
        <OTPScreen
          callback={() => {
            setOtpSuccess(true)
          }}
          endpoint="api-keys/auth"
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
          endpoint="api-keys/auth"
          setMasterPassword={setMasterPassword}
        />
      )
    }

    return (
      <>
        <QueryWrapper query={entriesQuery}>
          {entries => (
            <div className="mt-8 mb-24 flex-1 lg:mb-6">
              {entries.map((entry, idx) => (
                <EntryItem
                  key={entry.id}
                  entry={entry}
                  hasDivider={idx !== entries.length - 1}
                  masterPassword={masterPassword}
                  setDeleteConfirmationModalOpen={
                    setDeleteConfirmationModalOpen
                  }
                  setExistingData={setExistingData}
                  setModifyAPIKeyModalOpenType={setModifyAPIKeyModalOpenType}
                />
              ))}
            </div>
          )}
        </QueryWrapper>
        <ModifyAPIKeyModal
          challenge={challenge!}
          existingData={existingData}
          masterPassword={masterPassword}
          openType={modifyAPIKeyModalOpenType}
          onClose={() => {
            setModifyAPIKeyModalOpenType(null)
          }}
        />
        <DeleteConfirmationModal
          apiEndpoint="api-keys"
          data={existingData}
          isOpen={deleteConfirmationModalOpen}
          itemName="API Key"
          nameKey="name"
          queryKey={['api-keys', 'entries', masterPassword, challenge!]}
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
      {otpSuccess && masterPassword !== '' && (
        <FAB
          onClick={() => {
            setModifyAPIKeyModalOpenType('create')
          }}
        />
      )}
    </ModuleWrapper>
  )
}

export default APIKeys
