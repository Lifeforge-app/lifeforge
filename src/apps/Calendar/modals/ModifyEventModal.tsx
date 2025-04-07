import { UseQueryResult } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('apps.calendar')

  const [formState, setFormState] = useState<ICalendarEventFormState>({
    type: 'single',
    title: '',
    start: '',
    end: '',
    category: '',
    location: '',
    reference_link: '',
    description: ''
  })
  const ref = useRef<HTMLInputElement>(null)

  const FIELDS: IFieldProps<ICalendarEventFormState>[] = useMemo(
    () => [
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
        id: 'location',
        required: false,
        type: 'text',
        label: 'Location',
        icon: 'tabler:map-pin',
        placeholder: 'Event location'
      },
      {
        id: 'reference_link',
        required: false,
        label: 'Reference link',
        icon: 'tabler:link',
        type: 'text',
        placeholder: 'https://example.com'
      },
      {
        id: 'description',
        required: false,
        label: 'Description',
        icon: 'tabler:file-text',
        type: 'textarea',
        placeholder: 'Event description'
      },
      {
        id: 'type',
        required: true,
        label: 'Event type',
        icon: 'tabler:repeat',
        type: 'listbox',
        options: [
          {
            icon: 'tabler:calendar',
            value: 'single',
            text: t('eventTypes.single')
          },
          {
            icon: 'tabler:repeat',
            value: 'recurring',
            text: t('eventTypes.recurring')
          }
        ]
      },
      ...(formState.type === 'single'
        ? ([
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
            }
          ] as IFieldProps<ICalendarEventFormState>[])
        : [])
    ],
    [formState.type, categoriesQuery.data]
  )

  useEffect(() => {
    if (existedData !== null) {
      setFormState({
        type: existedData.is_recurring ? 'recurring' : 'single',
        title: existedData.title ?? '',
        start: dayjs(existedData.start).toISOString(),
        end: dayjs(existedData.end).toISOString(),
        category: existedData.category ?? '',
        location: existedData.location ?? '',
        reference_link: existedData.reference_link ?? '',
        description: existedData.description ?? ''
      })
    } else {
      setFormState({
        type: 'single',
        title: '',
        category: '',
        start: '',
        end: '',
        location: '',
        reference_link: '',
        description: ''
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
