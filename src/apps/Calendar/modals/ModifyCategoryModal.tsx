import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'

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
}: ModifyCategoryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [data, setData] = useState<ICalendarCategoryFormState>({
    name: '',
    icon: '',
    color: '#FFFFFF'
  })

  const FIELDS: IFieldProps<ICalendarCategoryFormState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Category name',
      icon: 'tabler:category',
      placeholder: 'Category name',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Category icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
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
      namespace="apps.calendar"
      openType={openType}
      queryKey={['calendar', 'categories']}
      setData={setData}
      sortBy="name"
      sortMode="asc"
      title={`category.${innerOpenType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyCategoryModal
