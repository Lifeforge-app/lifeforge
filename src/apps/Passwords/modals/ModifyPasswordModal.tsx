import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  ColorInput,
  IconInput,
  ModalHeader,
  TextInput
} from '@lifeforge/ui'

import { usePasswordContext } from '@apps/Passwords/providers/PasswordsProvider'

import fetchAPI from '@utils/fetchAPI'

import { encrypt } from '../../../core/security/utils/encryption'
import {
  IPasswordEntry,
  IPasswordFormState
} from '../interfaces/password_interfaces'

function ModifyPasswordModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: IPasswordEntry | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.passwords')
  const { masterPassword } = usePasswordContext()

  const [formState, setFormState] = useState<IPasswordFormState>({
    name: '',
    icon: '',
    color: '',
    website: '',
    username: '',
    password: ''
  })

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

    const challenge = await fetchAPI<string>('passwords/entries/challenge')
    const encryptedMaster = encrypt(masterPassword, challenge)

    try {
      const data = await fetchAPI<IPasswordEntry>(
        `passwords/entries${type === 'update' ? '/' + existedData?.id : ''}`,
        {
          method: type === 'create' ? 'POST' : 'PATCH',
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

          if (type === 'create') {
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
      onClose()
    }
  }

  useEffect(() => {
    if (type === 'create') {
      setFormState({
        name: '',
        icon: '',
        color: '',
        website: '',
        username: '',
        password: ''
      })
    } else if (type === 'update' && existedData !== null) {
      setFormState({
        name: existedData.name,
        icon: existedData.icon,
        color: existedData.color,
        website: existedData.website,
        username: existedData.username,
        password: existedData.decrypted ?? ''
      })
    }
  }, [type])

  return (
    <div>
      <ModalHeader
        icon={
          {
            create: 'tabler:plus',
            update: 'tabler:pencil'
          }[type as 'create' | 'update']
        }
        namespace="apps.passwords"
        title={`password.${type}`}
        onClose={onClose}
      />
      <div className="flex w-full flex-col space-y-3">
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
        />
        <ColorInput
          color={formState.color}
          name="Service Color"
          namespace="apps.passwords"
          setColor={handleChange('color')}
        />
        <TextInput
          darker
          noAutoComplete
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
          icon="tabler:key"
          name="Password"
          namespace="apps.passwords"
          placeholder="Your password"
          setValue={handleChange('password')}
          value={formState.password}
        />
      </div>
      <Button
        className="mt-6 w-full"
        icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
        loading={loading}
        onClick={() => {
          onSubmit().catch(console.error)
        }}
      >
        {type === 'create' ? 'Create' : 'Update'}
      </Button>
    </div>
  )
}

export default ModifyPasswordModal
