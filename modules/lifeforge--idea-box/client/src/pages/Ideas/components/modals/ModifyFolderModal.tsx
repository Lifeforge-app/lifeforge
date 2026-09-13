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
import type { IdeaBoxFolder } from '@/providers/IdeaBoxProvider'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required'),
  color: z.string()
})

function ModifyFolderModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: IdeaBoxFolder
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.folders.create
      : forgeAPI.folders.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ideaBox', 'folders']
        })
      },
      onError: error => {
        toast.error(`Failed to ${type} folder: ${error.message}`)
      }
    })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      name: initialData?.name || '',
      icon: initialData?.icon || 'tabler:folder',
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
          await mutation.mutateAsync({
            ...data,
            container: id!,
            parent: path?.split('/').pop() || ''
          })
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.ideaBox',
        title: `folder.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:folder"
        label="Folder name"
        name="name"
        placeholder="My Folder"
      />
      <IconField
        required
        control={form.control}
        label="Folder icon"
        name="icon"
      />
      <ColorField control={form.control} label="Folder color" name="color" />
    </FormModal>
  )
}

export default ModifyFolderModal
