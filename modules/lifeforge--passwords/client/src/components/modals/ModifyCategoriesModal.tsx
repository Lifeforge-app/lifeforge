import type { PasswordCategory } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  ColorField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color must be a valid hex color (e.g. #FF0000)'
    ),
  icon: z.string().min(1, 'Category icon is required')
})

function ModifyCategoriesModal({
  onClose,
  data: { modifyType, initialData }
}: {
  onClose: () => void
  data: {
    modifyType: 'create' | 'update'
    initialData?: PasswordCategory
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (modifyType === 'create'
      ? forgeAPI.categories.create
      : forgeAPI.categories.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.categories.key
        })
      }
    })
  )
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: mutation.mutateAsync,
        template: modifyType
      }}
      uiConfig={{
        icon: modifyType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.passwords',
        title: `category.${modifyType}`,
        onClose
      }}
    >
      <TextField
        autoFocus
        required
        control={form.control}
        icon="tabler:category"
        label="category.name"
        name="name"
        placeholder="My category"
      />
      <ColorField
        required
        control={form.control}
        label="category.color"
        name="color"
      />
      <IconField
        required
        control={form.control}
        label="category.icon"
        name="icon"
      />
    </FormModal>
  )
}

export default ModifyCategoriesModal
