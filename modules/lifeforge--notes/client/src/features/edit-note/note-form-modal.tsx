import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { type InferInput, useForgeMutation } from '@lifeforge/api'
import {
  FormModal,
  TextAreaField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import type { Note } from '@/entities/note'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  content: z.string(),
  title: z.string().trim().min(1, 'Title is required')
})

export function NoteFormModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Note
  }
  onClose: () => void
}) {
  const createMutation = useForgeMutation(forgeAPI.notes.create, {
    action: 'create',
    queryKey: forgeAPI.notes.key
  })
  const updateMutation = useForgeMutation(
    forgeAPI.notes.update.input({ id: initialData?.id ?? '' }),
    {
      action: 'update',
      queryKey: forgeAPI.notes.key
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
  const title = type === 'create' ? 'New note' : 'Edit note'

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: type,
        handler: async values => {
          const payload = values as InferInput<
            typeof forgeAPI.notes.create
          >['body']
          await (
            type === 'create' ? createMutation : updateMutation
          ).mutateAsync(payload)
        }
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: false,
        onClose,
        title
      }}
    >
      <TextField
        autoFocus
        control={form.control}
        icon="tabler:abc"
        label="Title"
        name="title"
        placeholder="Give your note a title"
        required={true}
        variant="plain"
      />
      <TextAreaField
        control={form.control}
        icon="tabler:pencil"
        label="Content"
        name="content"
        placeholder="Write your note..."
        variant="plain"
      />
    </FormModal>
  )
}
