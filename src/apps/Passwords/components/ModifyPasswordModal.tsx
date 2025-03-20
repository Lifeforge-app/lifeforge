import { useQueryClient } from '@tanstack/react-query'
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

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../../core/security/utils/encryption'
import {
  IPasswordEntry,
  IPasswordFormState
} from '../interfaces/password_interfaces'

function ModifyPasswordModal() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.passwords')
  const {
    masterPassword,
    modifyPasswordModalOpenType: openType,
    existedData,
    setModifyPasswordModalOpenType
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
    if (
      Object.values(formState).some(
        value => typeof value === 'string' && value.trim() === ''
      )
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const challenge = await fetchAPI<string>('passwords/password/challenge')
    const encryptedMaster = encrypt(masterPassword, challenge)

    try {
      const data = await fetchAPI<IPasswordEntry>(
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

      queryClient.setQueryData<IPasswordEntry[]>(
        ['passwords', 'entries'],
        prev => {
          if (!prev) return prev

          if (openType === 'create') {
            return [...prev, data]
          }

          return prev.map(password => {
            if (password.id === existedData?.id) {
              return data
            }
            return password
          })
        }
      )
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
          namespace="apps.passwords"
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
            namespace="apps.passwords"
            placeholder="Google"
            setValue={handleChange('name')}
            value={formState.name}
          />
          <IconInput
            icon={formState.icon}
            name="Service Icon"
            namespace="apps.passwords"
            setIcon={handleChange('icon')}
            setIconSelectorOpen={setIconSelectorOpen}
          />
          <ColorInput
            color={formState.color}
            name="Service Color"
            namespace="apps.passwords"
            setColor={handleChange('color')}
            setColorPickerOpen={setColorPickerOpen}
          />
          <TextInput
            darker
            noAutoComplete
            className="mt-6"
            icon="tabler:link"
            name="Website"
            namespace="apps.passwords"
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
            namespace="apps.passwords"
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
            namespace="apps.passwords"
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

export default ModifyPasswordModal
