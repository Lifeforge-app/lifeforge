import { cookieParse } from 'pocketbase'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  ColorInput,
  ColorPickerModal,
  IconInput,
  IconPickerModal,
  ModalHeader,
  ModalWrapper,
  TextInput
} from '@lifeforge/ui'

import { usePasswordContext } from '@modules/Passwords/providers/PasswordsProvider'

import { encrypt } from '@utils/encryption'
import fetchAPI from '@utils/fetchAPI'

import { IPasswordFormState } from '../interfaces/password_interfaces'

function CreatePasswordModal() {
  const { t } = useTranslation('modules.passwords')
  const {
    masterPassword,
    modifyPasswordModalOpenType: openType,
    existedData,
    setModifyPasswordModalOpenType,
    refreshPasswordList
  } = usePasswordContext()

  const [formState, setFormState] = useState<IPasswordFormState>({
    name: '',
    icon: '',
    color: '',
    website: '',
    username: '',
    password: ''
  })

  const [iconSelectorOpen, setIconSelectorOpen] = useState(false)
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(field: keyof IPasswordFormState) {
    return (value: string) => {
      setFormState({ ...formState, [field]: value })
    }
  }

  async function onSubmit() {
    if (Object.values(formState).some(value => value.trim() === '')) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const challenge = await fetch('passwords/password/challenge', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    }).then(async res => {
      const data = await res.json()
      if (res.ok && data.state === 'success') {
        return data.data
      } else {
        throw new Error('Failed to get challenge')
      }
    })

    const encryptedMaster = encrypt(masterPassword, challenge)

    try {
      await fetchAPI(
        `passwords/password${
          openType === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: {
            ...formState,
            password: encrypt(formState.password, challenge),
            master: encryptedMaster
          }
        }
      )

      refreshPasswordList()
    } catch {
      toast.error('Failed to create password')
    } finally {
      setLoading(false)
      setModifyPasswordModalOpenType(null)
    }
  }

  useEffect(() => {
    if (openType === 'create') {
      setFormState({
        name: '',
        icon: '',
        color: '',
        website: '',
        username: '',
        password: ''
      })
    } else if (openType === 'update' && existedData !== null) {
      setFormState({
        name: existedData.name,
        icon: existedData.icon,
        color: existedData.color,
        website: existedData.website,
        username: existedData.username,
        password: existedData.decrypted ?? ''
      })
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
            setValue={handleChange('name')}
            value={formState.name}
          />
          <IconInput
            icon={formState.icon}
            name="Service Icon"
            namespace="modules.passwords"
            setIcon={handleChange('icon')}
            setIconSelectorOpen={setIconSelectorOpen}
          />
          <ColorInput
            color={formState.color}
            name="Service Color"
            namespace="modules.passwords"
            setColor={handleChange('color')}
            setColorPickerOpen={setColorPickerOpen}
          />
          <TextInput
            darker
            noAutoComplete
            className="mt-6"
            icon="tabler:link"
            name="Website"
            namespace="modules.passwords"
            placeholder="https://google.com"
            setValue={handleChange('website')}
            value={formState.website}
          />
          <TextInput
            darker
            noAutoComplete
            className="mt-6"
            icon="tabler:user"
            name="Username or Email"
            namespace="modules.passwords"
            placeholder="johndoe1234@gmail.com"
            setValue={handleChange('username')}
            value={formState.username}
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
            setValue={handleChange('password')}
            value={formState.password}
          />
          <Button
            className="mt-6"
            icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
            loading={loading}
            onClick={() => {
              onSubmit().catch(console.error)
            }}
          >
            {openType === 'create' ? 'Create' : 'Update'}
          </Button>
        </form>
      </ModalWrapper>
      <IconPickerModal
        isOpen={iconSelectorOpen}
        setOpen={setIconSelectorOpen}
        setSelectedIcon={handleChange('icon')}
      />
      <ColorPickerModal
        color={formState.color}
        isOpen={colorPickerOpen}
        setColor={handleChange('color')}
        setOpen={setColorPickerOpen}
      />
    </>
  )
}

export default CreatePasswordModal
