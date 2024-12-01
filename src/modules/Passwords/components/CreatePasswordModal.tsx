import { t } from 'i18next'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import IconInput from '@components/ButtonsAndInputs/IconPicker/IconInput'
import IconSelector from '@components/ButtonsAndInputs/IconPicker/IconPickerModal'
import Input from '@components/ButtonsAndInputs/Input'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IPasswordEntry } from '@interfaces/password_interfaces'
import { encrypt } from '@utils/encryption'
import APIRequest from '@utils/fetchData'

function CreatePasswordModal({
  openType,
  onClose,
  refreshPasswordList,
  masterPassword,
  existedData
}: {
  openType: 'create' | 'update' | null
  onClose: () => void
  refreshPasswordList: () => void
  masterPassword: string
  existedData: IPasswordEntry | null
}): React.ReactElement {
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
        onClose()
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
          title={
            {
              create: 'Create Password',
              update: 'Update Password'
            }[openType as 'create' | 'update']
          }
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[openType as 'create' | 'update']
          }
          onClose={onClose}
        />
        <form
          onSubmit={e => {
            e.preventDefault()
          }}
          className="flex w-full flex-col"
        >
          <input type="password" className="hidden" />
          <Input
            name="Service Name"
            icon="tabler:lock"
            value={name}
            updateValue={setName}
            darker
            placeholder="Google"
          />
          <IconInput
            icon={icon}
            setIcon={setIcon}
            name="Service Icon"
            setIconSelectorOpen={setIconSelectorOpen}
          />
          <ColorInput
            color={color}
            name="Service Color"
            setColorPickerOpen={setColorPickerOpen}
            updateColor={setColor}
          />
          <Input
            name="Website"
            icon="tabler:link"
            value={website}
            updateValue={setWebsite}
            darker
            placeholder="https://google.com"
            className="mt-6"
            noAutoComplete
          />
          <Input
            name="Username / Email"
            icon="tabler:user"
            value={username}
            updateValue={setUsername}
            darker
            placeholder="johndoe1234@gmail.com"
            className="mt-6"
            noAutoComplete
          />
          <Input
            name="Password"
            icon="tabler:key"
            value={password}
            updateValue={setPassword}
            isPassword
            darker
            placeholder="Your password"
            className="mt-6"
            noAutoComplete
          />
          <CreateOrModifyButton
            onClick={() => {
              onSubmit().catch(console.error)
            }}
            loading={loading}
            className="mt-6"
            type={openType}
          />
        </form>
      </ModalWrapper>
      <IconSelector
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={setIcon}
      />
      <ColorPickerModal
        color={color}
        isOpen={colorPickerOpen}
        setOpen={setColorPickerOpen}
        setColor={setColor}
      />
    </>
  )
}

export default CreatePasswordModal
