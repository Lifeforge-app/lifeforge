import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  FormModal,
  IconField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  icon: z.string().min(1, 'Required')
})

function ModifyModal({
  onClose,
  data: { type, initialData, stuff }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    initialData: unknown
    stuff: 'collections' | 'languages'
  }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI[stuff].create
      : forgeAPI[stuff].update.input({
          id: (initialData as { id?: string })?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI[stuff].key })
      },
      onError: () => {
        toast.error(
          `Failed to ${type} ${stuff === 'collections' ? 'collection' : 'language'}`
        )
      }
    })
  )

  const singleStuff = stuff === 'collections' ? 'collection' : 'language'

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...(initialData as Record<string, unknown>)
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: mutation.mutateAsync
      }}
      uiConfig={{
        icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
        namespace: 'apps.booksLibrary',
        title: `${singleStuff}.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:book"
        label={`${singleStuff} name`}
        name="name"
        placeholder={`Project ${singleStuff}`}
      />
      <IconField
        required
        control={form.control}
        label={`${singleStuff} icon`}
        name="icon"
      />
    </FormModal>
  )
}

export default ModifyModal
