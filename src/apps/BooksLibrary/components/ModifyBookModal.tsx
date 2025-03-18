import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function ModifyBookModal() {
  const queryClient = useQueryClient()
  const {
    entries: {
      modifyDataModalOpenType,
      setModifyDataModalOpenType,
      existedData,
      setExistedData
    },
    languages: { data: languages },
    categories: { data: categories }
  } = useBooksLibraryContext()

  const [data, setData] = useState<{
    authors: string
    category: string
    edition: string
    extension: string
    isbn: string
    languages: string[]
    md5: string
    publisher: string
    size: string | number
    thumbnail: string
    title: string
    year_published: string | number
  }>({
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
    if (data.title.trim() === '') {
      toast.error('Title cannot be empty')
    }

    if (data.year_published === '') {
      setData({ ...data, year_published: '' })
    }

    try {
      await fetchAPI(`books-library/entries/${existedData?.id}`, {
        method: 'PATCH',
        body: data
      })

      setModifyDataModalOpenType(null)
      setExistedData(null)
      queryClient.invalidateQueries({ queryKey: ['books-library', 'entries'] })
    } catch {
      toast.error('Failed to update book data')
    }
  }

  useEffect(() => {
    if (existedData !== null) {
      setData({ ...data, ...existedData })
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
      isOpen={modifyDataModalOpenType !== null}
      loading={typeof languages === 'string' || typeof categories === 'string'}
      namespace="apps.booksLibrary"
      openType="update"
      setData={setData}
      title="Modify Book Data"
      onClose={() => {
        setModifyDataModalOpenType(null)
      }}
      onSubmit={onSubmit}
    />
  )
}

export default ModifyBookModal
