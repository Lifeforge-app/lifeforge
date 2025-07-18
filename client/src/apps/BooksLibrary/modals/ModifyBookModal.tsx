import { useQueryClient } from '@tanstack/react-query'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'
import {
  BooksLibraryCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

import { IBooksLibraryFormSate } from '../interfaces/books_library_interfaces'
import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function ModifyBookModal({
  data: { existedData },
  onClose
}: {
  data: {
    existedData: ISchemaWithPB<BooksLibraryCollectionsSchemas.IEntry> | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const { languagesQuery, collectionsQuery } = useBooksLibraryContext()

  const [data, setData] = useState<IBooksLibraryFormSate>({
    authors: '',
    collection: '',
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
      type: 'text',
      disabled: true
    }
  ]

  async function onSubmit() {
    if (data.title.trim() === '') {
      toast.error('Title cannot be empty')
    }

    if (data.year_published === '') {
      setData({ ...data, year_published: '' })
    }

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `books-library/entries/${existedData?.id}`,
        {
          method: 'PATCH',
          body: data
        }
      )

      onClose()
      queryClient.invalidateQueries({ queryKey: ['books-library', 'entries'] })
    } catch {
      toast.error('Failed to update book data')
    }
  }

  useEffect(() => {
    if (existedData !== null) {
      setData({
        ...data,
        authors: existedData.authors,
        collection: existedData.collection,
        edition: existedData.edition,
        extension: existedData.extension,
        isbn: existedData.isbn,
        languages: existedData.languages,
        md5: existedData.md5,
        publisher: existedData.publisher,
        size: existedData.size.toString(),
        thumbnail: existedData.thumbnail,
        title: existedData.title,
        year_published: existedData.year_published.toString()
      })
      if (existedData.year_published === 0) {
        setData({ ...data, year_published: '' })
      }
    }
  }, [existedData])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon="tabler:pencil"
      loading={languagesQuery.isLoading || collectionsQuery.isLoading}
      namespace="apps.booksLibrary"
      openType="update"
      setData={setData}
      title="Modify Book Data"
      onClose={onClose}
      onSubmit={onSubmit}
    />
  )
}

export default ModifyBookModal
