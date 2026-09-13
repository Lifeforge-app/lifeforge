import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import {
  ColorField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { CalendarCategory } from '../Calendar'

const schema = z.object({
  name: z.string().min(1, 'Category name is required'),
  icon: z.string().min(1, 'Category icon is required'),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      'Color must be a valid hex color (e.g. #FF0000)'
    )
})

function ModifyCategoryModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: CalendarCategory
  }
  onClose: () => void
}) {
  const createMutation = useForgeMutation(forgeAPI.categories.create, {
    action: 'create',
    queryKey: forgeAPI.categories.list.key,
    onSuccess: () => onClose()
  })

  const updateMutation = useForgeMutation(
    forgeAPI.categories.update.input({ id: initialData?.id || '' }),
    {
      action: 'update',
      queryKey: forgeAPI.categories.list.key,
      onSuccess: () => onClose()
    }
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
        handler: data => {
          ;(type === 'create' ? createMutation : updateMutation).mutateAsync(
            data
          )
        },
        template: type
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',

        title: `category.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:category"
        label="Category name"
        name="name"
        placeholder="Category name"
      />
      <IconField
        required
        control={form.control}
        label="Category icon"
        name="icon"
      />
      <ColorField
        required
        control={form.control}
        label="Category color"
        name="color"
      />
    </FormModal>
  )
}

export default ModifyCategoryModal
