import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { decrypt, encrypt } from '../../../security/utils/encryption'
import {
  type IAPIKeyEntry,
  IAPIKeyFormState
} from '../interfaces/api_keys_interfaces'
import { fetchChallenge } from '../utils/fetchChallenge'

function ModifyAPIKeyModal({
  openType,
  onClose,
  existingData,
  masterPassword,
  challenge
}: {
  openType: 'create' | 'update' | null
  onClose: () => void
  existingData: IAPIKeyEntry | null
  masterPassword: string
  challenge: string
}) {
  const [formState, setFormState] = useState<IAPIKeyFormState>({
    keyId: '',
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
      required: true,
      placeholder: 'id-of-the-api-key',
      label: 'Key ID',
      id: 'keyId'
    },
    {
      icon: 'tabler:key',
      type: 'text',
      required: true,
      placeholder: 'My API Key',
      label: 'Key Name',
      id: 'name'
    },
    {
      icon: 'tabler:info-circle',
      type: 'text',
      required: true,
      placeholder: 'A short description of this key',
      label: 'Key Description',
      id: 'description'
    },
    {
      type: 'icon',
      required: true,
      label: 'Key Icon',
      id: 'icon'
    },
    {
      icon: 'tabler:key',
      type: 'text',
      required: true,
      isPassword: true,
      placeholder: '••••••••••••••••',
      label: 'API Key',
      id: 'key'
    }
  ]

  async function fetchKey() {
    const challenge = await fetchChallenge()

    try {
      const data = await fetchAPI<string>(
        `api-keys/entries/${existingData?.id}?master=${encodeURIComponent(
          encrypt(masterPassword, challenge)
        )}`
      )

      const decryptedKey = decrypt(data, challenge)
      const decryptedSecondTime = decrypt(decryptedKey, masterPassword)
      if (existingData === null) {
        toast.error('Failed to fetch key')
        return
      }

      setFormState({
        keyId: existingData.keyId,
        name: existingData.name,
        description: existingData.description,
        icon: existingData.icon,
        key: decryptedSecondTime
      })
    } catch {
      console.error('Failed to fetch key')
    } finally {
      setIsFetchingKey(false)
    }
  }

  useEffect(() => {
    if (openType === 'update' && existingData !== null) {
      setIsFetchingKey(true)
      fetchKey().catch(console.error)
    } else {
      setIsFetchingKey(false)
      setFormState({
        keyId: '',
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
      endpoint="api-keys/entries"
      fields={FIELDS}
      getFinalData={async originalData => {
        const challenge = await fetchChallenge()

        const encryptedKey = encrypt(formState.key, masterPassword)
        const encryptedMaster = encrypt(masterPassword, challenge)

        const encryptedEverything = encrypt(
          JSON.stringify({
            ...originalData,
            key: encryptedKey,
            master: encryptedMaster
          }),
          challenge
        )

        return { data: encryptedEverything }
      }}
      icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existingData?.id}
      isOpen={openType !== null}
      loading={isFetchingKey}
      namespace="core.apiKeys"
      openType={openType}
      queryKey={['api-keys', 'entries', masterPassword, challenge]}
      setData={setFormState}
      sortBy="name"
      sortMode="asc"
      title={`apiKey.${openType}`}
      onClose={onClose}
    />
  )
}

export default ModifyAPIKeyModal
