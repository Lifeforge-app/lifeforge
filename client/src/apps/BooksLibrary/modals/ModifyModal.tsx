import { useQueryClient } from '@tanstack/react-query'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

function ModifyModal({
  onClose,
  data: { type, existedData, stuff }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    existedData: any
    stuff: 'collections' | 'languages'
  }
}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.booksLibrary')
  const singleStuff = {
    collections: 'collection',
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
    if (type) {
      if (type === 'update') {
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
  }, [type, existedData])

  async function onSubmitButtonClick() {
    const { name, icon } = data
    if (name.trim().length === 0 || icon.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        import.meta.env.VITE_API_HOST,
        `books-library/${stuff}${
          type === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: type === 'create' ? 'POST' : 'PATCH',
          body: {
            name,
            icon
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: ['books-library', stuff] })
      onClose()
    } catch {
      toast.error(`Failed to ${type} ${singleStuff}`)
    }
  }

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={type === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      namespace="apps.booksLibrary"
      openType={type}
      setData={setData}
      title={`${_.camelCase(singleStuff)}.${type}`}
      onClose={onClose}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyModal
