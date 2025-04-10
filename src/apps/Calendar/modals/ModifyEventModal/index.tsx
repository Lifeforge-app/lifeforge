import { UseQueryResult } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  type ICalendarCategory,
  type ICalendarEvent,
  ICalendarEventFormState
} from '../../interfaces/calendar_interfaces'
import EventTimeSelector from './components/EventTimeSelector'

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
    type: 'single',
    title: '',
    start: '',
    end: '',
    use_google_map: false,
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
        id: 'use_google_map',
        required: false,
        label: 'Use Google Map',
        icon: 'tabler:brand-google-maps',
        type: 'checkbox'
      },
      ...[
        (formState.use_google_map
          ? {
              id: 'location',
              required: true,
              type: 'location',
              label: 'Location',
              icon: 'tabler:map-pin',
              placeholder: 'Event location'
            }
          : {
              id: 'location',
              required: false,
              type: 'text',
              label: 'Location',
              icon: 'tabler:map-pin',
              placeholder: 'Event location'
            }) as IFieldProps<ICalendarEventFormState>
      ],
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
      }
    ],
    [formState.type, categoriesQuery.data, formState.use_google_map]
  )

  useEffect(() => {
    if (existedData !== null) {
      setFormState({
        type: existedData.is_recurring ? 'recurring' : 'single',
        title: existedData.title ?? '',
        start: dayjs(existedData.start).toISOString(),
        end: dayjs(existedData.end).toISOString(),
        category: existedData.category ?? '',
        use_google_map: existedData.use_google_map ?? false,
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
        use_google_map: false,
        location: '',
        reference_link: '',
        description: ''
      })
    }
  }, [openType, existedData])

  return (
    <FormModal
      additionalFields={
        <EventTimeSelector formState={formState} setFormState={setFormState} />
      }
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
