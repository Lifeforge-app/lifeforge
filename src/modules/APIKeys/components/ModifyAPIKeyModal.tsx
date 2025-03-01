import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import FormModal from '@components/modals/FormModal'
import {
  IAPIKeyFormState,
  type IAPIKeyEntry
} from '@interfaces/api_keys_interfaces'
import { IFieldProps } from '@interfaces/modal_interfaces'
import { decrypt, encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'
import { fetchChallenge } from '../utils/fetchChallenge'

function ModifyAPIKeyModal({
  openType,
  onClose,
  existingData,
  masterPassword
}: {
  openType: 'create' | 'update' | null
  onClose: () => void
  existingData: IAPIKeyEntry | null
  masterPassword: string
}): React.ReactElement {
  const { t } = useTranslation('modules.apiKeys')
  const [formState, setFormState] = useState<IAPIKeyFormState>({
    id: '',
    name: '',
    description: '',
    icon: '',
    key: ''
  })
  const [isFetchingKey, setIsFetchingKey] = useState(true)

  const FIELDS: IFieldProps<IAPIKeyFormState>[] = [
    {
      icon: 'tabler:id',
      type: 'text',
      placeholder: 'id-of-the-api-key',
      label: 'Key ID',
      id: 'id'
    },
    {
      icon: 'tabler:key',
      type: 'text',
      placeholder: 'My API Key',
      label: 'Key Name',
      id: 'name'
    },
    {
      icon: 'tabler:info-circle',
      type: 'text',
      placeholder: 'A short description of this key',
      label: 'Key Description',
      id: 'description'
    },
    {
      type: 'icon',
      label: 'Key Icon',
      id: 'icon'
    },
    {
      icon: 'tabler:key',
      type: 'text',
      isPassword: true,
      placeholder: '••••••••••••••••',
      label: 'API Key',
      id: 'key'
    }
  ]

  async function onSubmit(): Promise<void> {
    if (Object.values(formState).some(value => value === '')) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    const challenge = await fetchChallenge()

    const encryptedKey = encrypt(formState.key, masterPassword)
    const encryptedMaster = encrypt(masterPassword, challenge)

    const encryptedEverything = encrypt(
      JSON.stringify({
        ...formState,
        key: encryptedKey,
        master: encryptedMaster
      }),
      challenge
    )

    await APIRequest({
      endpoint: `api-keys${
        openType === 'update' ? `/${existingData?.id}` : ''
      }`,
      method: openType === 'update' ? 'PUT' : 'POST',
      body: { data: encryptedEverything },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        onClose()
      }
    })
  }

  async function fetchKey(): Promise<void> {
    const challenge = await fetchChallenge()

    await APIRequest({
      endpoint: `api-keys/${existingData?.id}?master=${encodeURIComponent(
        encrypt(masterPassword, challenge)
      )}`,
      method: 'GET',
      callback(data) {
        const decryptedKey = decrypt(data.data, challenge)
        const decryptedSecondTime = decrypt(decryptedKey, masterPassword)
        setFormState({
          ...formState,
          key: decryptedSecondTime
        })
      },
      onFailure: () => {
        console.error('Failed to fetch key')
      },
      finalCallback: () => {
        setIsFetchingKey(false)
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && existingData !== null) {
      setFormState({
        id: existingData.keyId,
        name: existingData.name,
        description: existingData.description,
        icon: existingData.icon,
        key: ''
      })
      fetchKey().catch(console.error)
    } else {
      setFormState({
        id: '',
        name: '',
        description: '',
        icon: '',
        key: ''
      })
    }
  }, [openType])

  return (
    <FormModal
      data={formState}
      fields={FIELDS}
      icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      isOpen={openType !== null}
      loading={isFetchingKey}
      namespace="modules.apiKeys"
      openType={openType}
      setData={setFormState}
      title={`apiKey.${openType}`}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

export default ModifyAPIKeyModal
