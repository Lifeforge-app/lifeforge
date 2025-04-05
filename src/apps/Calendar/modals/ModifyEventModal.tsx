import { UseQueryResult } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  type ICalendarCategory,
  type ICalendarEvent,
  ICalendarEventFormState
} from '../interfaces/calendar_interfaces'

interface ModifyEventModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: Partial<ICalendarEvent> | null
  categoriesQuery: UseQueryResult<ICalendarCategory[]>
  eventQueryKey: unknown[]
}

function ModifyEventModal({
  openType,
  setOpenType,
  existedData,
  categoriesQuery,
  eventQueryKey
}: ModifyEventModalProps) {
  const [formState, setFormState] = useState<ICalendarEventFormState>({
    title: '',
    start: '',
    end: '',
    category: '',
    location: '',
    reference_link: ''
  })
  const ref = useRef<HTMLInputElement>(null)

  const FIELDS: IFieldProps<ICalendarEventFormState>[] = [
    {
      id: 'title',
      required: true,
      label: 'Event title',
      icon: 'tabler:calendar',
      type: 'text',
      placeholder: 'My event'
    },
    {
      id: 'category',
      required: true,
      label: 'Event Category',
      icon: 'tabler:list',
      type: 'listbox',
      options: categoriesQuery.isSuccess
        ? categoriesQuery.data.map(({ name, color, icon, id }) => ({
            value: id,
            text: name,
            icon,
            color
          }))
        : [],
      nullOption: 'tabler:apps-off'
    },
    {
      id: 'start',
      required: true,
      label: 'Start time',
      icon: 'tabler:clock',
      type: 'datetime',
      hasTime: true,
      index: 0,
      modalRef: ref
    },
    {
      id: 'end',
      required: true,
      label: 'End time',
      icon: 'tabler:clock',
      hasTime: true,
      type: 'datetime',
      index: 1,
      modalRef: ref
    },
    {
      id: 'location',
      required: false,
      type: 'location',
      label: 'Location'
    },
    {
      id: 'reference_link',
      required: false,
      label: 'Reference link',
      icon: 'tabler:link',
      type: 'text',
      placeholder: 'https://example.com'
    }
  ]

  useEffect(() => {
    if (openType === 'create') {
      if (!existedData) {
        setFormState({
          title: '',
          category: '',
          start: '',
          end: '',
          location: '',
          reference_link: ''
        })
      } else {
        setFormState({
          title: '',
          category: '',
          start: dayjs(existedData.start).toISOString(),
          end: dayjs(existedData.end).toISOString(),
          location: existedData.location ?? '',
          reference_link: existedData.reference_link ?? ''
        })
      }
    }

    if (openType === 'update' && existedData !== null) {
      setFormState({
        title: existedData.title ?? '',
        start: dayjs(existedData.start).toISOString(),
        end: dayjs(existedData.end).toISOString(),
        category: existedData.category ?? '',
        location: existedData.location ?? '',
        reference_link: existedData.reference_link ?? ''
      })
    }
  }, [openType, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="calendar/events"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      id={existedData?.id}
      isOpen={openType !== null}
      loading={categoriesQuery.isLoading}
      modalRef={ref}
      namespace="apps.calendar"
      openType={openType}
      queryKey={eventQueryKey}
      setData={setFormState}
      title={`event.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyEventModal
