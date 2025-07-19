import { useDebounce } from '@uidotdev/usehooks'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useRef, useState } from 'react'

import {
  CalendarCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'
import { CalendarControllersSchemas } from 'shared/types/controllers'

function ModifyCalendarModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: ISchemaWithPB<CalendarCollectionsSchemas.ICalendar> | null
  }
  onClose: () => void
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  const innerOpenType = useDebounce(type, type === null ? 300 : 0)

  const [formState, setFormState] = useState<
    CalendarControllersSchemas.ICalendars[
      | 'createCalendar'
      | 'updateCalendar']['body']
  >({
    name: '',
    color: '#FFFFFF'
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
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
      setFormState(existedData)
    } else {
      setFormState({
        name: '',
        color: '#FFFFFF'
      })
    }
  }, [innerOpenType, existedData])

  return (
    <FormModal
      data={formState}
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
      setData={setFormState}
      sortBy="name"
      sortMode="asc"
      title={`calendar.${innerOpenType}`}
      onClose={onClose}
    />
  )
}

export default ModifyCalendarModal
