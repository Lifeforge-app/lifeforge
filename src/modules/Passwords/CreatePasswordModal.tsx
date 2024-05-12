/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ColorInput from '@components/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ColorPicker/ColorPickerModal'
import IconSelector from '@components/IconSelector'
import IconInput from '@components/IconSelector/IconInput'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'

function CreatePasswordModal({
  isOpen,
  onClose,
  refreshPasswordList,
  masterPassword
}: {
  isOpen: boolean
  onClose: () => void
  refreshPasswordList: () => void
  masterPassword: string
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

    fetch(`${import.meta.env.VITE_API_HOST}/passwords/password/create`, {
      method: 'POST',
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
    })
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
    if (isOpen) {
      setName('')
      setIcon('')
      setColor('')
      setWebsite('')
      setUsername('')
      setPassword('')
    }
  }, [isOpen])

  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalHeader
          title="New Password"
          icon="tabler:plus"
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
          <button
            type="button"
            onClick={onSubmit}
            className="flex-center mt-8 flex w-full gap-2 whitespace-nowrap rounded-lg bg-custom-500 py-4 pl-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800"
          >
            {loading ? (
              <Icon icon="svg-spinners:180-ring" className="h-6 w-6" />
            ) : (
              <>
                <Icon icon="tabler:plus" className="text-xl" />
                Create
              </>
            )}
          </button>
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
