import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useRef, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  type ICalendarCategory,
  ICalendarCategoryFormState
} from '../interfaces/calendar_interfaces'

interface ModifyCategoryModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: ICalendarCategory | null
}

function ModifyCategoryModal({
  openType,
  setOpenType,
  existedData
}: ModifyCategoryModalProps): React.ReactElement {
  const modalRef = useRef<HTMLDivElement>(null)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [data, setData] = useState<ICalendarCategoryFormState>({
    name: '',
    icon: '',
    color: '#FFFFFF'
  })

  const FIELDS: IFieldProps<typeof data>[] = [
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
    <FormModal
      data={data}
      endpoint="calendar/categories"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[innerOpenType!]
      }
      id={existedData?.id}
      isOpen={openType !== null}
      modalRef={modalRef}
      namespace="modules.calendar"
      openType={openType}
      queryKey={['calendar', 'categories']}
      setData={setData}
      title={`category.${innerOpenType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyCategoryModal
