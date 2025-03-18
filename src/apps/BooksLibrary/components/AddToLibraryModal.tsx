import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { FormModal, type IFieldProps } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import { IBooksLibraryFormSate } from '../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function AddToLibraryModal({
  isOpen,
  onClose,
  md5
}: {
  isOpen: boolean
  onClose: () => void
  md5: string | null
}) {
  const {
    categories: { data: categories },
    languages: { data: languages }
  } = useBooksLibraryContext()
  const fetchedDataQuery = useAPIQuery<{
    md5: string
    thumbnail: string
    authors: string
    edition: string
    extension: string
    isbn: string
    languages: string[]
    publisher: string
    size: string
    title: string
    year_published: string
  }>(
    `books-library/libgen/local-library-data/${md5}`,
    ['books-library', 'libgen', 'local-library-data', md5],
    md5 !== null
  )

  const [data, setData] = useState<IBooksLibraryFormSate>({
    authors: '',
    category: '',
    edition: '',
    extension: '',
    isbn: '',
    languages: [],
    md5: '',
    publisher: '',
    size: '',
    thumbnail: '',
    title: '',
    year_published: ''
  })

  useEffect(() => {
    setData({
      authors: '',
      category: '',
      edition: '',
      extension: '',
      isbn: '',
      languages: [],
      md5: '',
      publisher: '',
      size: '',
      thumbnail: '',
      title: '',
      year_published: ''
    })
  }, [md5])

  const FIELDS: IFieldProps<IBooksLibraryFormSate>[] = [
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
      id: 'category',
      label: 'Category',
      icon: 'tabler:category',
      type: 'listbox',
      nullOption: 'None',
      options:
        typeof categories !== 'string'
          ? categories.map(({ id, name, icon }) => ({
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
      type: 'text'
    },
    {
      id: 'languages',
      required: true,
      label: 'Languages',
      icon: 'tabler:language',
      type: 'listbox',
      multiple: true,
      options:
        typeof languages !== 'string'
          ? languages.map(({ id, name, icon }) => ({
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
      type: 'text',
      disabled: true
    }
  ]

  async function onSubmit() {
    try {
      await fetchAPI(`books-library/libgen/add-to-library/${md5}`, {
        method: 'POST',
        body: {
          metadata: data
        }
      })
      onClose()
      toast.success('Book added to download queue')
    } catch {
      toast.error('Failed to add book to download queue')
    }
  }

  useEffect(() => {
    if (fetchedDataQuery.data && typeof languages !== 'string') {
      setData({
        ...fetchedDataQuery.data,
        languages: languages
          .filter(lang =>
            fetchedDataQuery.data.languages.some(name => name === lang.name)
          )
          .map(lang => lang.id),
        category: ''
      })
    }
  }, [fetchedDataQuery.data, languages])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon="majesticons:book-plus-line"
      isOpen={isOpen}
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
