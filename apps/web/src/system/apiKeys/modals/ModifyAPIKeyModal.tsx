import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import {
  CheckboxField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import type { APIKeyEntry } from '..'

const schema = z
  .object({
    _type: z.enum(['create', 'update']),
    keyId: z
      .string()
      .regex(
        /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,
        'Key ID must be in kebab-case (e.g. my-api-key)'
      ),
    name: z.string().min(1, 'Key name is required'),
    icon: z.string().min(1, 'Key icon is required'),
    overrideKey: z.boolean(),
    key: z.string(),
    exposable: z.boolean()
  })
  .superRefine(({ _type, overrideKey, key }, ctx) => {
    if (_type === 'create' || (_type === 'update' && overrideKey)) {
      if (!key || key.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'API key is required',
          path: ['key']
        })
      }
    }
  })

function ModifyAPIKeyModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: APIKeyEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.apiKeys.entries.create
      : forgeAPI.apiKeys.entries.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      },
      onError: (error: Error) => {
        toast.error('Failed to save API key: ' + error.message)
      }
    })
  )
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      _type: type,
      keyId: initialData?.keyId || '',
      name: initialData?.name || '',
      icon: initialData?.icon || '',
      key: '',
      exposable: initialData?.exposable || false
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const overrideKey = useWatch({ control: form.control, name: 'overrideKey' })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async data => {
          const { _type: _omit, ...payload } = data

          await mutation.mutateAsync(payload)
        },
        template: type
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'common.api-keys',
        title: `apiKey.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:id"
        label="Key ID"
        name="keyId"
        placeholder="id-of-the-api-key"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:key"
        label="Key Name"
        name="name"
        placeholder="My API Key"
      />
      <IconField required control={form.control} label="Key Icon" name="icon" />
      {type === 'update' && (
        <CheckboxField
          control={form.control}
          icon="tabler:refresh"
          label="Override Key"
          name="overrideKey"
        />
      )}
      {(type === 'create' || overrideKey) && (
        <TextField
          isPassword
          required
          control={form.control}
          icon="tabler:key"
          label="API Key"
          name="key"
          placeholder="••••••••••••••••"
        />
      )}
      <CheckboxField
        control={form.control}
        icon="tabler:eye"
        label="isExposable"
        name="exposable"
      />
    </FormModal>
  )
}

export default ModifyAPIKeyModal
