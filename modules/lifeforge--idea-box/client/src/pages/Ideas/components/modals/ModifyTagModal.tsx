import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useForm } from 'react-hook-form'
import z from 'zod'

import type { InferInput } from '@lifeforge/api'
import {
  ColorField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'
import { toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { IdeaBoxTag } from '@/providers/IdeaBoxProvider'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required'),
  color: z.string()
})

function ModifyTagModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: IdeaBoxTag
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.tags.create
      : forgeAPI.tags.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ideaBox', 'tags'] })
      },
      onError: error => {
        toast.error(`Failed to ${type} tag: ${error.message}`)
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      name: initialData?.name || '',
      icon: initialData?.icon || 'tabler:tag',
      color: initialData?.color || '#FFFFFF'
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          await mutation.mutateAsync({ ...data, container: id || '' })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.ideaBox',
        title: `tag.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:tag"
        label="Tag name"
        name="name"
        placeholder="My tag"
      />
      <IconField required control={form.control} label="Tag icon" name="icon" />
      <ColorField control={form.control} label="Tag color" name="color" />
    </FormModal>
  )
}

export default ModifyTagModal
