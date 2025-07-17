import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useRef, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  ICalendarCalendar,
  ICalendarCalendarFormState
} from '@apps/Calendar/interfaces/calendar_interfaces'

function ModifyCalendarModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: ICalendarCalendar | null
  }
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  const innerOpenType = useDebounce(type, type === null ? 300 : 0)
  const [data, setData] = useState<ICalendarCalendarFormState>({
    name: '',
    color: '#FFFFFF'
  })

  const FIELDS: IFieldProps<ICalendarCalendarFormState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Calendar name',
      icon: 'tabler:calendar',
      placeholder: 'Calendar name',
      type: 'text'
    },
    {
      id: 'color',
      required: true,
      label: 'Calendar color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
      setData(existedData)
    } else {
      setData({
        name: '',
        color: '#FFFFFF'
      })
    }
  }, [innerOpenType, existedData])

  return (
    <FormModal
      data={data}
      endpoint="calendar/calendars"
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
      queryKey={['calendar', 'calendars']}
      setData={setData}
      sortBy="name"
      sortMode="asc"
      title={`calendar.${innerOpenType}`}
      onClose={onClose}
    />
  )
}

export default ModifyCalendarModal
