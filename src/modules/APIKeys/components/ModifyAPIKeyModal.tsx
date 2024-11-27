import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import IconPicker from '@components/ButtonsAndInputs/IconSelector/IconPicker'
import Input from '@components/ButtonsAndInputs/Input'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ModalHeader from '@components/Modals/ModalHeader'
import { type APIKeyEntry } from '@interfaces/api_keys_interfaces'
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
  existingData: APIKeyEntry | null
  masterPassword: string
}): React.ReactElement {
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
          title={`${openType === 'create' ? 'Create' : 'Update'} API Key`}
          onClose={onClose}
        />
        <Input
          darker
          icon="tabler:id"
          name="Key ID"
          placeholder="IdOfTheAPIKey"
          value={id}
          updateValue={setId}
        />
        <Input
          darker
          icon="tabler:key"
          name="Key Name"
          placeholder="My API Key"
          value={name}
          updateValue={setName}
          className="mt-4"
        />
        <Input
          darker
          icon="tabler:info-circle"
          name="Key Description"
          placeholder="A short description of this key"
          value={description}
          updateValue={setDescription}
          className="mt-4"
        />
        <IconInput
          icon={icon}
          setIcon={setIcon}
          setIconSelectorOpen={setIconSelectorOpen}
          name="Key Icon"
        />
        <Input
          darker
          icon="tabler:key"
          name="API Key"
          placeholder="API Key"
          value={key}
          isPassword
          updateValue={setKey}
          className="mt-4"
        />
        <CreateOrModifyButton
          loading={loading}
          type={openType === 'create' ? 'create' : 'update'}
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        />
      </ModalWrapper>
      <IconPicker
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setIcon}
      />
    </>
  )
}

export default ModifyAPIKeyModal