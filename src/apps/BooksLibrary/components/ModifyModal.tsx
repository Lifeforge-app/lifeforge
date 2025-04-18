import { useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { useBooksLibraryContext } from '../providers/BooksLibraryProvider'

function ModifyModal({ stuff }: { stuff: 'categories' | 'languages' }) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.booksLibrary')
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData
  } = useBooksLibraryContext()[stuff]
  const singleStuff = {
    categories: 'category',
    languages: 'language'
  }[stuff]
  const [data, setData] = useState({
    name: '',
    icon: ''
  })
  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      label: `${singleStuff} name`,
      icon: 'tabler:book',
      required: true,
      placeholder: `Project ${singleStuff}`,
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: `${singleStuff} icon`,
      type: 'icon'
    }
  ]

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setData(existedData)
        }
      } else {
        setData({
          name: '',
          icon: ''
        })
      }
    }
  }, [openType, existedData])

  async function onSubmitButtonClick() {
    const { name, icon } = data
    if (name.trim().length === 0 || icon.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        `books-library/${stuff}${
          openType === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: {
            name,
            icon
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: ['books-library', stuff] })
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error(`Failed to ${openType} ${singleStuff}`)
    }
  }

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      isOpen={openType !== null}
      namespace="apps.booksLibrary"
      openType={openType}
      setData={setData}
      title={`${_.camelCase(singleStuff)}.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyModal
