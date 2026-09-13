import type { PasswordEntry } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  ColorField,
  FormModal,
  IconField,
  ListboxField,
  NumberField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { encrypt } from '@/utils/crypto'

const schema = z.object({
  icon: z.string().min(1, 'Required'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color'),
  website: z.string().min(1, 'Required'),
  username: z.string().optional().default('').catch(''),
  password: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  category: z.string().optional(),
  rotation_interval: z.number().min(-1)
})

function ModifyPasswordModal({
  data: { type, initialData, vek },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: PasswordEntry & {
      decrypted?: string
    }
    vek: CryptoKey
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const { t } = useModuleTranslation()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.entries.create
      : forgeAPI.entries.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.entries.list.key
        })
        queryClient.invalidateQueries({
          queryKey: forgeAPI.categories.list.key
        })
      },
      onError: () => {
        toast.error(t('toasts.entryModifyFailed'))
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      name: initialData?.name || '',
      icon: initialData?.icon || 'tabler:lock',
      color: initialData?.color || '#000000',
      website: initialData?.website || '',
      username: initialData?.username || '',
      password: initialData?.decrypted || '',
      category: initialData?.category || '',
      rotation_interval: initialData?.rotation_interval ?? 90
    },
    resolver: zodResolver(schema)
  })

  const categoryOptions = (categoriesQuery.data || []).map(category => ({
    text: category.name,
    color: category.color,
    icon: category.icon,
    value: category.id
  }))

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          if (!vek) return

          const encryptedPassword = await encrypt(data.password, vek)
          const passwordChanged =
            type === 'update' &&
            data.password !== (initialData?.decrypted || '')

          await mutation.mutateAsync({
            ...data,
            username: data.username || '',
            category: data.category ?? '',
            password: encryptedPassword,
            ...(passwordChanged ? { password_changed: true } : {})
          })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        loading: categoriesQuery.isLoading,
        namespace: 'apps.passwords',
        title: `password.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:lock"
        label="password.serviceName"
        name="name"
        placeholder="My Service"
      />
      <IconField
        required
        control={form.control}
        label="password.serviceIcon"
        name="icon"
      />
      <ColorField
        required
        control={form.control}
        label="password.serviceColor"
        name="color"
      />
      <ListboxField
        control={form.control}
        icon="tabler:category"
        label="password.category"
        name="category"
        options={categoryOptions}
      />
      <TextField
        required
        control={form.control}
        icon="tabler:link"
        label="password.website"
        name="website"
        placeholder="https://example.com"
      />
      <TextField
        control={form.control}
        icon="tabler:user"
        label="password.usernameOrEmail"
        name="username"
        placeholder="johndoe1234"
      />
      <TextField
        required
        actionButtonProps={{
          icon: 'tabler:dice',
          onClick: () => {
            const alphabets = 'abcdefghijklmnopqrstuvwxyz'

            const ALPHABETS = alphabets.toUpperCase()

            const numbers = '0123456789'

            const symbols = '!@#$%^&*()_+[]{}|;:,.<>?'

            const allCharacters = `${alphabets}${ALPHABETS}${numbers}${symbols}`

            const passwordLength = 16

            const randomIndices = new Uint32Array(passwordLength)
            crypto.getRandomValues(randomIndices)
            let generatedPassword = ''

            for (let i = 0; i < passwordLength; i++) {
              generatedPassword +=
                allCharacters[randomIndices[i] % allCharacters.length]
            }

            form.setValue('password', generatedPassword, {
              shouldValidate: true
            })

            copy(generatedPassword)
            toast.success(t('toasts.passwordCopied'))
          }
        }}
        control={form.control}
        icon="tabler:key"
        label="password.password"
        name="password"
        placeholder="Your password"
      />
      <NumberField
        required
        control={form.control}
        icon="tabler:refresh"
        label="password.rotationInterval"
        name="rotation_interval"
      />
    </FormModal>
  )
}

export default ModifyPasswordModal
