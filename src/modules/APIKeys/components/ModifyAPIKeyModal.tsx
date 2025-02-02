import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import { IconInput, IconPickerModal, TextInput } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IAPIKeyEntry } from '@interfaces/api_keys_interfaces'
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
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [description, setDescription] = useState('')
  const [key, setKey] = useState('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(): Promise<void> {
    if (
      id.trim() === '' ||
      name.trim() === '' ||
      key.trim() === '' ||
      icon.trim() === '' ||
      description.trim() === ''
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }
    setLoading(true)

    const challenge = await fetchChallenge(setLoading)

    const encryptedKey = encrypt(key, masterPassword)
    const encryptedMaster = encrypt(masterPassword, challenge)

    const encryptedEverything = encrypt(
      JSON.stringify({
        id,
        name,
        description,
        icon,
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
      },
      finalCallback: () => {
        setLoading(false)
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
        setKey(decryptedSecondTime)
      },
      onFailure: () => {
        console.error('Failed to fetch key')
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && existingData !== null) {
      setId(existingData.keyId)
      setName(existingData.name)
      setDescription(existingData.description)
      setIcon(existingData.icon)
      fetchKey().catch(console.error)
    } else {
      setId('')
      setName('')
      setDescription('')
      setIcon('')
      setKey('')
    }
  }, [openType])

  return (
    <>
      <ModalWrapper isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          namespace="modules.apiKeys"
          title={`apiKey.${openType}`}
          onClose={onClose}
        />
        <TextInput
          darker
          icon="tabler:id"
          name="Key ID"
          namespace="modules.apiKeys"
          placeholder="IdOfTheAPIKey"
          updateValue={setId}
          value={id}
        />
        <TextInput
          darker
          className="mt-4"
          icon="tabler:key"
          name="Key Name"
          namespace="modules.apiKeys"
          placeholder="My API Key"
          updateValue={setName}
          value={name}
        />
        <TextInput
          darker
          className="mt-4"
          icon="tabler:info-circle"
          name="Key Description"
          namespace="modules.apiKeys"
          placeholder="A short description of this key"
          updateValue={setDescription}
          value={description}
        />
        <IconInput
          icon={icon}
          name="Key Icon"
          namespace="modules.apiKeys"
          setIcon={setIcon}
          setIconSelectorOpen={setIconSelectorOpen}
        />
        <TextInput
          darker
          isPassword
          className="mt-4"
          icon="tabler:key"
          name="API Key"
          namespace="modules.apiKeys"
          placeholder="••••••••••••••••"
          updateValue={setKey}
          value={key}
        />
        <CreateOrModifyButton
          loading={loading}
          type={openType === 'create' ? 'create' : 'update'}
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        />
      </ModalWrapper>
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setIcon}
      />
    </>
  )
}

export default ModifyAPIKeyModal
