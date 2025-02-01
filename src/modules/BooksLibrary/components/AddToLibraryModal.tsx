import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import useFetch from '@hooks/useFetch'
import { type IBooksLibraryEntry } from '@interfaces/books_library_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import APIRequest from '@utils/fetchData'

function AddToLibraryModal({
  isOpen,
  onClose,
  md5
}: {
  isOpen: boolean
  onClose: () => void
  md5: string | null
}): React.ReactElement {
  const {
    categories: { data: categories },
    languages: { data: languages }
  } = useBooksLibraryContext()
  const [fetchedData] = useFetch<IBooksLibraryEntry>(
    `books-library/libgen/local-library-data/${md5}`,
    md5 !== null
  )

  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
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
    }
  )

  useEffect(() => {
    setData({
      authors: '',
      category: '',
      edition: '',
      extension: '',
      isbn: '',
      languages: [],
      md5,
      publisher: '',
      size: '',
      thumbnail: '',
      title: '',
      year_published: ''
    })
  }, [md5])

  const FIELDS: IFieldProps[] = [
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
      label: 'Authors',
      icon: 'tabler:users',
      placeholder: 'Authors',
      type: 'text'
    },
    {
      id: 'publisher',
      label: 'Publisher',
      icon: 'tabler:building',
      placeholder: 'Publisher',
      type: 'text'
    },
    {
      id: 'year_published',
      label: 'Publication Year',
      icon: 'tabler:calendar',
      placeholder: '20xx',
      type: 'text'
    },
    {
      id: 'languages',
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

  async function onSubmit(): Promise<void> {
    await APIRequest({
      endpoint: `books-library/libgen/add-to-library/${md5}`,
      method: 'POST',
      body: {
        metadata: data
      },
      callback: () => {
        onClose()
        toast.success('Book added to download queue')
      },
      failureInfo: 'downloaded'
    })
  }

  useEffect(() => {
    if (typeof fetchedData !== 'string' && typeof languages !== 'string') {
      setData({
        ...fetchedData,
        languages: languages
          .filter(lang =>
            fetchedData.languages.some(name => name === lang.name)
          )
          .map(lang => lang.id)
      })
    }
  }, [fetchedData, languages])

  return (
    <Modal
      namespace="modules.booksLibrary"
      isOpen={isOpen}
      title="Add to library"
      icon="majesticons:book-plus-line"
      data={data}
      setData={setData}
      fields={FIELDS}
      submitButtonIcon="tabler:download"
      submitButtonLabel="Download"
      onClose={onClose}
      onSubmit={onSubmit}
      loading={typeof fetchedData === 'string'}
    />
  )
}

export default AddToLibraryModal
