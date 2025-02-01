import { useDebounce } from '@uidotdev/usehooks'

import React, { useEffect, useReducer, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

interface ModifyCategoryModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: ICalendarCategory | null
  refreshCategories: () => void
}

function ModifyCategoryModal({
  openType,
  setOpenType,
  existedData,
  refreshCategories
}: ModifyCategoryModalProps): React.ReactElement {
  const { t } = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [data, setData] = useReducer(
    (state, _newState) => {
      return { ...state, ..._newState }
    },
    {
      name: '',
      icon: '',
      color: '#FFFFFF'
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      label: 'Category name',
      icon: 'tabler:category',
      placeholder: 'Category name',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Category icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Category color',
      type: 'color'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { name, icon, color } = data
    if (
      name.trim().length === 0 ||
      icon.trim().length === 0 ||
      color.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    const category = {
      name: name.trim(),
      icon: icon.trim(),
      color: color.trim()
    }

    await APIRequest({
      endpoint:
        'calendar/category' +
        (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: category,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        refreshCategories()
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
      setData(existedData)
    } else {
      setData({
        name: '',
        icon: '',
        color: '#FFFFFF'
      })
    }
  }, [innerOpenType, existedData])

  return (
    <Modal
      namespace="modules.calendar"
      isOpen={openType !== null}
      modalRef={modalRef}
      title={`category.${innerOpenType}`}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[innerOpenType!]
      }
      openType={openType}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
      fields={FIELDS}
      data={data}
      setData={setData}
    />
  )
}

export default ModifyCategoryModal
