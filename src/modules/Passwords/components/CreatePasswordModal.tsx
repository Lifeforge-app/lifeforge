import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import {
  ColorInput,
  ColorPickerModal,
  IconInput,
  IconPickerModal,
  TextInput
} from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { usePasswordContext } from '@providers/PasswordsProvider'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

function CreatePasswordModal(): React.ReactElement {
  const { t } = useTranslation('modules.passwords')
  const {
    masterPassword,
    modifyPasswordModalOpenType: openType,
    existedData,
    setModifyPasswordModalOpenType,
    refreshPasswordList
  } = usePasswordContext()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')
  const [color, setColor] = useState('')
  const [website, setWebsite] = useState('')
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(): Promise<void> {
    if (
      name.trim() === '' ||
      icon.trim() === '' ||
      color.trim() === '' ||
      website.trim() === '' ||
      username.trim() === '' ||
      password.trim() === ''
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const challenge = await fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/password/challenge`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    ).then(async res => {
      const data = await res.json()
      if (res.ok && data.state === 'success') {
        return data.data
      } else {
        throw new Error('Failed to get challenge')
      }
    })

    const encryptedMaster = encrypt(masterPassword, challenge)

    await APIRequest({
      endpoint: `passwords/password${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name,
        icon,
        color,
        website,
        username,
        password: encrypt(password, challenge),
        master: encryptedMaster
      },
      successInfo: 'create',
      failureInfo: 'create',
      callback: () => {
        refreshPasswordList()
      },
      finalCallback: () => {
        setLoading(false)
        setModifyPasswordModalOpenType(null)
      }
    })
  }

  useEffect(() => {
    if (openType === 'create') {
      setName('')
      setIcon('')
      setColor('')
      setWebsite('')
      setUsername('')
      setPassword('')
    } else if (openType === 'update' && existedData !== null) {
      setName(existedData.name)
      setIcon(existedData.icon)
      setColor(existedData.color)
      setWebsite(existedData.website)
      setUsername(existedData.username)
      setPassword(existedData.decrypted ?? '')
    }
  }, [openType])

  return (
    <>
      <ModalWrapper isOpen={openType !== null}>
        <ModalHeader
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[openType as 'create' | 'update']
          }
          namespace="modules.passwords"
          title={`password.${openType}`}
          onClose={() => {
            setModifyPasswordModalOpenType(null)
          }}
        />
        <form
          className="flex w-full flex-col"
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <input className="hidden" type="password" />
          <TextInput
            darker
            icon="tabler:lock"
            name="Service Name"
            namespace="modules.passwords"
            placeholder="Google"
            updateValue={setName}
            value={name}
          />
          <IconInput
            icon={icon}
            name="Service Icon"
            namespace="modules.passwords"
            setIcon={setIcon}
            setIconSelectorOpen={setIconSelectorOpen}
          />
          <ColorInput
            color={color}
            name="Service Color"
            namespace="modules.passwords"
            setColorPickerOpen={setColorPickerOpen}
            updateColor={setColor}
          />
          <TextInput
            darker
            noAutoComplete
            className="mt-6"
            icon="tabler:link"
            name="Website"
            namespace="modules.passwords"
            placeholder="https://google.com"
            updateValue={setWebsite}
            value={website}
          />
          <TextInput
            darker
            noAutoComplete
            className="mt-6"
            icon="tabler:user"
            name="Username or Email"
            namespace="modules.passwords"
            placeholder="johndoe1234@gmail.com"
            updateValue={setUsername}
            value={username}
          />
          <TextInput
            darker
            isPassword
            noAutoComplete
            className="mt-6"
            icon="tabler:key"
            name="Password"
            namespace="modules.passwords"
            placeholder="Your password"
            updateValue={setPassword}
            value={password}
          />
          <CreateOrModifyButton
            className="mt-6"
            loading={loading}
            type={openType}
            onClick={() => {
              onSubmit().catch(console.error)
            }}
          />
        </form>
      </ModalWrapper>
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setIcon}
      />
      <ColorPickerModal
        color={color}
        isOpen={colorPickerOpen}
        setColor={setColor}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default CreatePasswordModal
