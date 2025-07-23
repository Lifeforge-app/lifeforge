import { FormModal, type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAPIQuery } from 'shared'
import { fetchAPI } from 'shared'

import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function AddToLibraryModal({
  onClose,
  data: { isLibgenIS, book }
}: {
  onClose: () => void
  data: {
    isLibgenIS: boolean
    book: Record<string, any>
  }
}) {
  const md5 = book.md5 || null

  const {
    collectionsQuery,
    languagesQuery,
    miscellaneous: { addToProcesses }
  } = useBooksLibraryContext()

  const fetchedDataQuery = useAPIQuery<
    BooksLibraryControllersSchemas.ILibgen['getLocalLibraryData']['response']
  >(
    `books-library/libgen/local-library-data/${md5}`,
    ['books-library', 'libgen', 'local-library-data', md5],
    md5 !== null && isLibgenIS
  )

  const [data, setData] = useState<
    BooksLibraryControllersSchemas.ILibgen['addToLibrary']['body']
  >({
    authors: '',
    collection: '',
    edition: '',
    extension: '',
    isbn: '',
    languages: [],
    md5: '',
    publisher: '',
    size: 0,
    thumbnail: '',
    title: '',
    year_published: 0
  })

  useEffect(() => {
    if (!isLibgenIS) {
      setData({
        authors: book['Author(s)'],
        collection: '',
        edition: book['Edition'],
        extension: book['Extension'],
        isbn: book['ISBN'],
        languages: [
          languagesQuery.data?.find(lang => lang.name === book['Language'])
            ?.id || ''
        ],
        md5: book.md5,
        publisher: book['Publisher'],
        size: book['Size'].toString(),
        thumbnail: book['image'],
        title: book['Title'],
        year_published: book['Year']
      })

      return
    }

    setData({
      authors: '',
      collection: '',
      edition: '',
      extension: '',
      isbn: '',
      languages: [],
      md5: '',
      publisher: '',
      size: 0,
      thumbnail: '',
      title: '',
      year_published: 0
    })
  }, [isLibgenIS, book, languagesQuery.data])

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'md5',
      label: 'MD5',
      icon: 'tabler:id',
      placeholder: 'MD5 Hash of the file',
      type: 'text',
      disabled: true
    },
    {
      id: 'isbn',
      label: 'ISBN',
      icon: 'tabler:barcode',
      placeholder: 'ISBN',
      type: 'text'
    },
    {
      id: 'collection',
      label: 'Collection',
      icon: 'heroicons-outline:collection',
      type: 'listbox',
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
    {
      id: 'title',
      required: true,
      label: 'Book Title',
      icon: 'tabler:book',
      placeholder: 'Title of the Book',
      type: 'text'
    },
    {
      id: 'edition',
      label: 'Edition',
      icon: 'tabler:number',
      placeholder: 'Edition',
      type: 'text'
    },
    {
      id: 'authors',
      required: true,
      label: 'Authors',
      icon: 'tabler:users',
      placeholder: 'Authors',
      type: 'text'
    },
    {
      id: 'publisher',
      required: true,
      label: 'Publisher',
      icon: 'tabler:building',
      placeholder: 'Publisher',
      type: 'text'
    },
    {
      id: 'year_published',
      required: true,
      label: 'Publication Year',
      icon: 'tabler:calendar',
      placeholder: '20xx',
      type: 'number'
    },
    {
      id: 'languages',
      required: true,
      label: 'Languages',
      icon: 'tabler:language',
      type: 'listbox',
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
    {
      id: 'extension',
      label: 'Extension',
      icon: 'tabler:file-text',
      placeholder: 'Extension',
      type: 'text',
      disabled: true
    },
    {
      id: 'size',
      label: 'File Size',
      icon: 'tabler:dimensions',
      placeholder: 'Size',
      type: 'number',
      disabled: true
    }
  ]

  async function onSubmit() {
    try {
      const taskId = await fetchAPI<string>(
        import.meta.env.VITE_API_HOST,
        `books-library/libgen/add-to-library/${md5}`,
        {
          method: 'POST',
          body: data
        }
      )

      addToProcesses(taskId)

      onClose()
      toast.success('Book added to download queue')
    } catch {
      toast.error('Failed to add book to download queue')
    }
  }

  useEffect(() => {
    if (
      fetchedDataQuery.data &&
      !languagesQuery.isLoading &&
      languagesQuery.data
    ) {
      setData({
        ...fetchedDataQuery.data,
        languages: languagesQuery.data
          .filter(lang =>
            fetchedDataQuery.data.languages.some(name => name === lang.name)
          )
          .map(lang => lang.id),
        collection: ''
      })
    }
  }, [fetchedDataQuery.data, languagesQuery.data])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon="majesticons:book-plus-line"
      loading={fetchedDataQuery.isLoading}
      namespace="apps.booksLibrary"
      setData={setData}
      submitButtonProps={{
        children: 'Download',
        icon: 'tabler:download'
      }}
      title="Add to library"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

export default AddToLibraryModal
