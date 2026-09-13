import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  FormModal,
  ListboxField,
  NumberField,
  TextField,
  createDefaultValues,
  fileValueSchema,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  authors: z.string().min(1, 'Required'),
  collection: z.string(),
  edition: z.string().catch(''),
  isbn: z.string().catch(''),
  languages: z.array(z.string()),
  publisher: z.string().min(1, 'Required'),
  title: z.string().min(1, 'Required'),
  year_published: z.number().nonnegative(),
  file: fileValueSchema
})

function ModifyBookModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData: Partial<z.infer<typeof schema>> & {
      id?: string
    }
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const collectionsQuery = useQuery(forgeAPI.collections.list.queryOptions())
  const languagesQuery = useQuery(forgeAPI.languages.list.queryOptions())

  const mutation = useMutation(
    forgeAPI.entries.update
      .input({ id: initialData.id || '' })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: forgeAPI.entries.key })
          queryClient.invalidateQueries({
            queryKey: forgeAPI.collections.key
          })
          queryClient.invalidateQueries({
            queryKey: forgeAPI.languages.key
          })
        },
        onError: () => {
          toast.error('Failed to update book data')
        }
      })
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    resolver: zodResolver(schema)
  })

  const collectionOptions =
    !collectionsQuery.isLoading && collectionsQuery.data
      ? collectionsQuery.data.map(({ id, name, icon }) => ({
          text: name[0].toUpperCase() + name.slice(1),
          value: id,
          icon
        }))
      : []

  const languageOptions =
    !languagesQuery.isLoading && languagesQuery.data
      ? languagesQuery.data.map(({ id, name, icon }) => ({
          text: name[0].toUpperCase() + name.slice(1),
          value: id,
          icon
        }))
      : []

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'update',
        handler: mutation.mutateAsync
      }}
      uiConfig={{
        icon: 'tabler:pencil',
        loading: languagesQuery.isLoading || collectionsQuery.isLoading,
        namespace: 'apps.booksLibrary',
        title: 'Modify Book Data',
        onClose
      }}
    >
      <TextField
        control={form.control}
        icon="tabler:barcode"
        label="ISBN"
        name="isbn"
        placeholder="ISBN"
      />
      <ListboxField
        control={form.control}
        icon="heroicons-outline:collection"
        label="Collection"
        name="collection"
        options={collectionOptions}
      />
      <TextField
        required
        control={form.control}
        icon="tabler:book"
        label="Book Title"
        name="title"
        placeholder="Title of the Book"
      />
      <TextField
        control={form.control}
        icon="tabler:number"
        label="Edition"
        name="edition"
        placeholder="Edition"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:users"
        label="Authors"
        name="authors"
        placeholder="Authors"
      />
      <TextField
        required
        control={form.control}
        icon="tabler:building"
        label="Publisher"
        name="publisher"
        placeholder="Publisher"
      />
      <NumberField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Publication Year"
        name="year_published"
        placeholder="20xx"
      />
      <ListboxField
        multiple
        required
        control={form.control}
        icon="tabler:language"
        label="Languages"
        name="languages"
        options={languageOptions}
      />
    </FormModal>
  )
}

export default ModifyBookModal
