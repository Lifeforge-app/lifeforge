import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import FormModal from '@components/modals/FormModal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
import APIRequest from '@utils/fetchData'
import { toCamelCase } from '@utils/strings'

function ModifyModal({
  stuff
}: {
  stuff: 'categories' | 'languages'
}): React.ReactElement {
  const { t } = useTranslation('modules.booksLibrary')
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData,
    refreshData
  } = useBooksLibraryContext()[stuff]
  const singleStuff = {
    categories: 'category',
    languages: 'language'
  }[stuff]
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      icon: ''
    }
  )
  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      label: `${singleStuff} name`,
      icon: 'tabler:book',
      placeholder: `Project ${singleStuff}`,
      type: 'text'
    },
    {
      id: 'icon',
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

  async function onSubmitButtonClick(): Promise<void> {
    const { name, icon } = data
    if (name.trim().length === 0 || icon.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint: `books-library/${stuff}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name,
        icon
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshData()
        setExistedData(null)
        setOpenType(null)
      }
    })
  }

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      isOpen={openType !== null}
      namespace="modules.booksLibrary"
      openType={openType}
      setData={setData}
      title={`${toCamelCase(singleStuff)}.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyModal
