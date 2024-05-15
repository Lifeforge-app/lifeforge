/* eslint-disable multiline-ternary */
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ColorPicker/ColorPickerModal'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import IconSelector from '@components/IconSelector'
import IconInput from '@components/IconSelector/IconInput'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { type IPasswordEntry } from '@typedec/Password'

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

  const updateName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value)
  }

  const updateWebsite = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setWebsite(e.target.value)
  }

  const updateUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value)
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value)
  }

  function onSubmit(): void {
    if (
      name.trim() === '' ||
      icon.trim() === '' ||
      color.trim() === '' ||
      website.trim() === '' ||
      username.trim() === '' ||
      password.trim() === ''
    ) {
      toast.error('Please fill in all the fields')
      return
    }

    setLoading(true)

    fetch(
      `${import.meta.env.VITE_API_HOST}/passwords/password/${openType}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      {
        method: openType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          name,
          icon,
          color,
          website,
          username,
          password,
          masterPassword
        })
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok && data.state === 'success') {
          refreshPasswordList()
          toast.success('Password created successfully')
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Couldn't create the password. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
        onClose()
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
      setPassword(existedData.decrypted)
    }
  }, [openType])

  return (
    <>
      <Modal isOpen={openType !== null}>
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
            updateValue={updateName}
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
            updateColor={e => {
              setColor(e.target.value)
            }}
          />
          <Input
            name="Website"
            icon="tabler:link"
            value={website}
            updateValue={updateWebsite}
            darker
            placeholder="https://google.com"
            additionalClassName="mt-6"
            noAutoComplete
          />
          <Input
            name="Username / Email"
            icon="tabler:user"
            value={username}
            updateValue={updateUsername}
            darker
            placeholder="johndoe1234@gmail.com"
            additionalClassName="mt-6"
            noAutoComplete
          />
          <Input
            name="Password"
            icon="tabler:key"
            value={password}
            updateValue={updatePassword}
            isPassword
            darker
            placeholder="Your password"
            additionalClassName="mt-6"
            noAutoComplete
          />
          <CreateOrModifyButton
            onClick={onSubmit}
            loading={loading}
            className="mt-6"
            type={openType}
          />
        </form>
      </Modal>
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
