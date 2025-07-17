import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  ICalendarCalendar,
  ICalendarCategory,
  ICalendarEvent,
  ICalendarEventFormState
} from '@apps/Calendar/interfaces/calendar_interfaces'
import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import useAPIQuery from '@hooks/useAPIQuery'

import EventTimeSelector from './components/EventTimeSelector'

function ModifyEventModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: Partial<ICalendarEvent> | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const calendarsQuery = useAPIQuery<ICalendarCalendar[]>(
    'calendar/calendars',
    ['calendar', 'calendars']
  )
  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )
  const { eventQueryKey } = useCalendarStore()
  const [formState, setFormState] = useState<ICalendarEventFormState>({
    type: 'single',
    title: '',
    start: dayjs().startOf('day').toDate(),
    end: null,
    use_google_map: false,
    category: '',
    calendar: '',
    location: null,
    reference_link: '',
    description: '',
    recurring_rrule: '',
    recurring_duration_amount: '1',
    recurring_duration_unit: 'day'
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
          ? categoriesQuery.data?.map(({ name, color, icon, id }) => ({
              value: id,
              text: name,
              icon,
              color
            }))
          : [],
        nullOption: 'tabler:apps-off'
      },
      {
        id: 'calendar',
        label: 'Calendar',
        icon: 'tabler:calendar',
        type: 'listbox',
        options: calendarsQuery.isSuccess
          ? calendarsQuery.data?.map(({ name, color, id }) => ({
              value: id,
              text: name,
              color
            }))
          : [],
        nullOption: ''
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
    [
      formState.type,
      categoriesQuery.data,
      calendarsQuery.data,
      formState.use_google_map
    ]
  )

  useEffect(() => {
    if (existedData !== null) {
      setFormState({
        type: existedData.type ?? 'single',
        title: existedData.title ?? '',
        start: dayjs(existedData.start).toDate(),
        end: dayjs(existedData.end).toDate(),
        category: existedData.category ?? '',
        calendar: existedData.calendar ?? '',
        use_google_map: existedData.use_google_map ?? false,
        location: existedData.location ?? '',
        reference_link: existedData.reference_link ?? '',
        description: existedData.description ?? '',
        recurring_rrule: existedData.recurring_rrule ?? '',
        recurring_duration_amount:
          existedData.recurring_duration_amount?.toString() ?? '1',
        recurring_duration_unit: existedData.recurring_duration_unit ?? 'day'
      })
    } else {
      setFormState({
        type: 'single',
        title: '',
        category: '',
        calendar: '',
        start: dayjs().startOf('day').toDate(),
        end: null,
        use_google_map: false,
        location: '',
        reference_link: '',
        description: '',
        recurring_rrule: '',
        recurring_duration_amount: '1',
        recurring_duration_unit: 'day'
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      additionalFields={
        <EventTimeSelector
          formState={formState}
          setFormState={setFormState}
          type={type}
        />
      }
      customUpdateDataList={{
        create: () => {
          queryClient.invalidateQueries({
            queryKey: eventQueryKey
          })
          queryClient.invalidateQueries({
            queryKey: ['calendar', 'categories']
          })
          queryClient.invalidateQueries({
            queryKey: ['calendar', 'calendars']
          })
        },
        update: () => {
          queryClient.invalidateQueries({
            queryKey: eventQueryKey
          })
          queryClient.invalidateQueries({
            queryKey: ['calendar', 'categories']
          })
          queryClient.invalidateQueries({
            queryKey: ['calendar', 'calendars']
          })
        }
      }}
      data={formState}
      endpoint="calendar/events"
      fields={FIELDS}
      getFinalData={async originalData => {
        const data: Omit<ICalendarEvent, 'use_google_map'> = {
          ...originalData
        }
        delete data.use_google_map
        return data
      }}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={existedData?.id}
      loading={categoriesQuery.isLoading || calendarsQuery.isLoading}
      modalRef={ref}
      namespace="apps.calendar"
      openType={type}
      queryKey={eventQueryKey}
      setData={setFormState}
      title={`event.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyEventModal
