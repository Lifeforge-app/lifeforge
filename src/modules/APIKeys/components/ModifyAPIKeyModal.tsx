import React, { useEffect, useState } from 'react'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconInput from '@components/ButtonsAndInputs/IconSelector/IconInput'
import IconPicker from '@components/ButtonsAndInputs/IconSelector/IconPicker'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type APIKeyEntry } from '@interfaces/api_keys_interfaces'
import { encrypt, decrypt } from '@utils/encryption'
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

  function updateId(e: React.ChangeEvent<HTMLInputElement>): void {
    setId(e.target.value)
  }

  function updateName(e: React.ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value)
  }

  function updateDescription(e: React.ChangeEvent<HTMLInputElement>): void {
    setDescription(e.target.value)
  }

  function updateKey(e: React.ChangeEvent<HTMLInputElement>): void {
    setKey(e.target.value)
  }

  async function onSubmit(): Promise<void> {
    setLoading(true)

    const challenge = await fetchChallenge(setLoading)

    const encryptedKey = encrypt(key, masterPassword)
    const encryptedMaster = encrypt(masterPassword, challenge)

    const encryptedEverything = encrypt(
      JSON.stringify({
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
      <Modal isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          title={`${openType === 'create' ? 'Create' : 'Update'} API Key`}
          onClose={onClose}
        />
        <Input
          icon="tabler:id"
          name="Key ID"
          placeholder="IdOfTheAPIKey"
          value={id}
          updateValue={updateId}
        />
        <Input
          icon="tabler:key"
          name="Key Name"
          placeholder="My API Key"
          value={name}
          updateValue={updateName}
          additionalClassName="mt-4"
        />
        <Input
          icon="tabler:info-circle"
          name="Key Description"
          placeholder="A short description of this key"
          value={description}
          updateValue={updateDescription}
          additionalClassName="mt-4"
        />
        <IconInput
          icon={icon}
          setIcon={setIcon}
          setIconSelectorOpen={setIconSelectorOpen}
          name="Key Icon"
        />
        <Input
          icon="tabler:key"
          name="API Key"
          placeholder="API Key"
          value={key}
          isPassword
          updateValue={updateKey}
          additionalClassName="mt-4"
        />
        <CreateOrModifyButton
          loading={loading}
          type={openType === 'create' ? 'create' : 'update'}
          onClick={() => {
            onSubmit().catch(console.error)
          }}
        />
      </Modal>
      <IconPicker
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setIcon}
      />
    </>
  )
}

export default ModifyAPIKeyModal
