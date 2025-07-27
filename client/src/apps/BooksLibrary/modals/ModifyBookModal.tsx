import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { type InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import {
  type BooksLibraryEntry,
  useBooksLibraryContext
} from '../providers/BooksLibraryProvider'

function ModifyBookModal({
  data: { initialData },
  onClose
}: {
  data: {
    initialData: BooksLibraryEntry
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { languagesQuery, collectionsQuery } = useBooksLibraryContext()

  const mutation = useMutation(
    forgeAPI.booksLibrary.entries.update
      .input({
        id: initialData.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['booksLibrary', 'entries']
          })
        },
        onError: () => {
          toast.error('Failed to update book data')
        }
      })
  )

  const formProps = defineForm<
    InferInput<typeof forgeAPI.booksLibrary.entries.update>['body']
  >()
    .ui({
      icon: 'tabler:pencil',
      loading: languagesQuery.isLoading || collectionsQuery.isLoading,
      namespace: 'apps.booksLibrary',
      title: 'Modify Book Data',
      onClose,
      submitButton: 'update'
    })
    .typesMap({
      authors: 'text',
      collection: 'listbox',
      edition: 'text',
      isbn: 'text',
      languages: 'listbox',
      publisher: 'text',
      title: 'text',
      year_published: 'number'
    })
    .setupFields({
      isbn: {
        label: 'ISBN',
        icon: 'tabler:barcode',
        placeholder: 'ISBN'
      },
      collection: {
        label: 'Collection',
        icon: 'heroicons-outline:collection',
        multiple: false,
        nullOption: 'None',
        options:
          !collectionsQuery.isLoading && collectionsQuery.data
            ? collectionsQuery.data.map(({ id, name, icon }) => ({
                text: name[0].toUpperCase() + name.slice(1),
                value: id,
                icon
              }))
            : []
      },
      title: {
        required: true,
        label: 'Book Title',
        icon: 'tabler:book',
        placeholder: 'Title of the Book'
      },
      edition: {
        label: 'Edition',
        icon: 'tabler:number',
        placeholder: 'Edition'
      },
      authors: {
        required: true,
        label: 'Authors',
        icon: 'tabler:users',
        placeholder: 'Authors'
      },
      publisher: {
        required: true,
        label: 'Publisher',
        icon: 'tabler:building',
        placeholder: 'Publisher'
      },
      year_published: {
        required: true,
        label: 'Publication Year',
        icon: 'tabler:calendar',
        placeholder: '20xx'
      },
      languages: {
        required: true,
        label: 'Languages',
        icon: 'tabler:language',
        multiple: true,
        options:
          !languagesQuery.isLoading && languagesQuery.data
            ? languagesQuery.data.map(({ id, name, icon }) => ({
                text: name[0].toUpperCase() + name.slice(1),
                value: id,
                icon
              }))
            : []
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyBookModal
