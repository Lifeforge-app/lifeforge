import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import type { InferInput } from '@lifeforge/api'
import {
  ColorField,
  FileField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'
import { toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import type { IdeaBoxContainer } from '@/providers/IdeaBoxProvider'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  cover: z
    .object({
      file: z.any(),
      preview: z.string().nullable()
    })
    .nullable()
    .optional()
})

function ModifyContainerModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: IdeaBoxContainer
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.containers.create
      : forgeAPI.containers.update.input({
          id: initialData?.id || ''!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'containers']
        })
      },
      onError: () => {
        toast.error(
          `Failed to ${type === 'create' ? 'create' : 'update'} container`
        )
      }
    })
  )

  const imageGenAPIKeyExistsQuery = useQuery(
    forgeAPI.checkAPIKeys({ keys: 'openai' }).queryOptions()
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      name: initialData?.name || '',
      icon: initialData?.icon || '',
      color: initialData?.color || '#FFFFFF',
      cover: initialData?.cover
        ? {
            file: 'keep',
            preview: forgeAPI.getMedia({
              collectionId: initialData.collectionId,
              recordId: initialData.id,
              fieldId: initialData.cover,
              thumb: '0x500'
            })
          }
        : {
            file: null,
            preview: null
          }
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async data => {
          await mutation.mutateAsync(
            data as InferInput<
              (typeof forgeAPI.containers)[typeof type]
            >['body']
          )
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.ideaBox',
        title: `container.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:cube"
        label="Container name"
        name="name"
        placeholder="My container"
      />
      <IconField
        required
        control={form.control}
        label="Container icon"
        name="icon"
      />
      <ColorField
        required
        control={form.control}
        label="Container color"
        name="color"
      />
      <FileField
        control={form.control}
        icon="tabler:photo"
        label="Cover Image"
        name="cover"
      />
    </FormModal>
  )
}

export default ModifyContainerModal
