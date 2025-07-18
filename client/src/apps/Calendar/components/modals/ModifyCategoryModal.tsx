import { useDebounce } from '@uidotdev/usehooks'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useRef, useState } from 'react'

import {
  ICalendarCategory,
  ICalendarCategoryFormState
} from '@apps/Calendar/interfaces/calendar_interfaces'

function ModifyCategoryModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: ICalendarCategory | null
  }
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  const innerOpenType = useDebounce(type, type === null ? 300 : 0)

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
    if (type === 'update' && existedData !== null) {
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
      modalRef={modalRef}
      namespace="apps.calendar"
      openType={type}
      queryKey={['calendar', 'categories']}
      setData={setData}
      sortBy="name"
      sortMode="asc"
      title={`category.${innerOpenType}`}
      onClose={onClose}
    />
  )
}

export default ModifyCategoryModal
