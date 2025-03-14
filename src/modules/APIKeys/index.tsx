import { useAuth } from '@providers/AuthProvider'
import CreatePasswordScreen from '@security/components/CreatePasswordScreen'
import LockedScreen from '@security/components/LockedScreen'
import OTPScreen from '@security/components/OTPScreen'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  DeleteConfirmationModal,
  FAB,
  ModuleHeader,
  ModuleWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../core/security/utils/encryption'
import EntryItem from './components/EntryItem'
import ModifyAPIKeyModal from './components/ModifyAPIKeyModal'
import { type IAPIKeyEntry } from './interfaces/api_keys_interfaces'

function APIKeys() {
  const { t } = useTranslation('modules.apiKeys')
  const { userData } = useAuth()
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
      return <CreatePasswordScreen endpoint="api-keys/auth" />
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
            <div className="mb-24 mt-8 flex-1 lg:mb-6">
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
