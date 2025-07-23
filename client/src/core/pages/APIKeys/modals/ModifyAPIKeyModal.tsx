import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { fetchAPI } from 'shared'

import { decrypt, encrypt } from '../../../security/utils/encryption'
import {
  type IAPIKeyEntry,
  IAPIKeyFormState
} from '../interfaces/api_keys_interfaces'

function ModifyAPIKeyModal({
  data: { type, existedData, masterPassword },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: IAPIKeyEntry | null
    masterPassword: string
  }
  onClose: () => void
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
    const challenge = await fetchAPI<string>(
      import.meta.env.VITE_API_HOST,
      'api-keys/auth/challenge'
    )

    try {
      const data = await fetchAPI<string>(
        import.meta.env.VITE_API_HOST,
        `api-keys/entries/${existedData?.id}?master=${encodeURIComponent(
          encrypt(masterPassword, challenge)
        )}`
      )

      const decryptedKey = decrypt(data, challenge)

      const decryptedSecondTime = decrypt(decryptedKey, masterPassword)

      if (existedData === null) {
        toast.error('Failed to fetch key')

        return
      }

      setFormState({
        keyId: existedData.keyId,
        name: existedData.name,
        description: existedData.description,
        icon: existedData.icon,
        key: decryptedSecondTime
      })
    } catch {
      console.error('Failed to fetch key')
    } finally {
      setIsFetchingKey(false)
    }
  }

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
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
  }, [type])

  return (
    <FormModal
      data={formState}
      endpoint="api-keys/entries"
      fields={FIELDS}
      getFinalData={async originalData => {
        const challenge = await fetchAPI<string>(
          import.meta.env.VITE_API_HOST,
          'api-keys/auth/challenge'
        )

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
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={existedData?.id}
      loading={isFetchingKey}
      namespace="core.apiKeys"
      openType={type}
      queryKey={['api-keys', 'entries', masterPassword]}
      setData={setFormState}
      sortBy="name"
      sortMode="asc"
      title={`apiKey.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyAPIKeyModal
