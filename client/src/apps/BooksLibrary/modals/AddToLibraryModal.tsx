import { useMutation, useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { type InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function AddToLibraryModal({
  onClose,
  data: { provider, book }
}: {
  onClose: () => void
  data: {
    provider: string
    book: Record<string, any>
  }
}) {
  const md5 = book.md5 || null

  const {
    collectionsQuery,
    languagesQuery,
    miscellaneous: { addToProcesses }
  } = useBooksLibraryContext()

  const fetchedDataQuery = useQuery(
    forgeAPI.booksLibrary.libgen.getLocalLibraryData
      .input({ md5, provider })
      .queryOptions({
        enabled: Boolean(md5)
      })
  )

  const mutation = useMutation(
    forgeAPI.booksLibrary.libgen.addToLibrary.mutationOptions({
      onSuccess: taskId => {
        addToProcesses(taskId)
        toast.success('Book added to download queue')
      },
      onError: () => {
        toast.error('Failed to add book to download queue')
      }
    })
  )

  const formProps = defineForm<
    InferInput<typeof forgeAPI.booksLibrary.libgen.addToLibrary>['body']
  >()
    .ui({
      icon: 'majesticons:book-plus-line',
      loading: fetchedDataQuery.isLoading,
      namespace: 'apps.booksLibrary',
      submitButton: {
        children: 'Download',
        icon: 'tabler:download'
      },
      title: 'Add to library',
      onClose
    })
    .typesMap({
      md5: 'text',
      isbn: 'text',
      thumbnail: 'text',
      collection: 'listbox',
      title: 'text',
      edition: 'text',
      authors: 'text',
      publisher: 'text',
      year_published: 'number',
      languages: 'listbox',
      extension: 'text',
      size: 'number'
    })
    .setupFields({
      md5: {
        label: 'MD5',
        icon: 'tabler:id',
        placeholder: 'MD5 Hash of the file',
        disabled: true
      },
      isbn: {
        label: 'ISBN',
        icon: 'tabler:barcode',
        placeholder: 'ISBN'
      },
      collection: {
        multiple: false,
        label: 'Collection',
        icon: 'heroicons-outline:collection',
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
      },
      extension: {
        label: 'Extension',
        icon: 'tabler:file-text',
        placeholder: 'Extension',
        disabled: true
      },
      size: {
        label: 'File Size',
        icon: 'tabler:dimensions',
        placeholder: 'Size',
        disabled: true
      }
    })
    .initialData(
      fetchedDataQuery.data && !languagesQuery.isLoading && languagesQuery.data
        ? {
            ...fetchedDataQuery.data,
            languages: languagesQuery.data
              .filter(lang =>
                fetchedDataQuery.data.languages.some(
                  (name: string) => name === lang.name
                )
              )
              .map(lang => lang.id),
            collection: ''
          }
        : {
            md5: book.md5 || '',
            isbn: book.ISBN || '',
            collection: '',
            title: book.Title || '',
            edition: book.Edition || '',
            authors: book['Author(s)'] || '',
            publisher: book.Publisher || '',
            year_published: parseInt(book['Year Published'], 10) || 0,
            languages: [],
            thumbnail: book['image'],
            extension: book.Extension || '',
            size: parseInt(book.Size, 10) || 0
          }
    )
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })

  return <FormModal {...formProps} />
}

export default AddToLibraryModal
