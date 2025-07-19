import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAPIQuery } from 'shared/lib'
import { CalendarCollectionsSchemas } from 'shared/types/collections'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import EventTimeSelector from './components/EventTimeSelector'

type IFieldStates = {
  create: Omit<
    CalendarCollectionsSchemas.IEventsSingle &
      CalendarCollectionsSchemas.IEventsRecurring,
    'base_event' | 'exceptions' | 'start' | 'end'
  > & {
    start: Date | null
    end: Date | null
  }
  update: CalendarCollectionsSchemas.IEvent & {
    start: Date | null
    end: Date | null
    recurring_rule?: string
    duration_amount?: number
    duration_unit?: 'hour' | 'year' | 'month' | 'day' | 'week'
  }
}

function CreateEventModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData:
      | CalendarControllersSchemas.IEvents['getEventsByDateRange']['response'][number]
      | null
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const calendarsQuery = useAPIQuery<
    CalendarControllersSchemas.ICalendars['getAllCalendars']['response']
  >('calendar/calendars', ['calendar', 'calendars'])

  const categoriesQuery = useAPIQuery<
    CalendarControllersSchemas.ICategories['getAllCategories']['response']
  >('calendar/categories', ['calendar', 'categories'])

  const { eventQueryKey } = useCalendarStore()

  const [formState, setFormState] = useState<
    IFieldStates[typeof type extends 'create' ? 'create' : 'update']
  >(
    type === 'update' && existedData !== null
      ? {
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
          recurring_rule: '',
          duration_amount: 1,
          duration_unit: 'day' as const
        }
      : {
          type: 'single' as const,
          title: '',
          category: '',
          calendar: '',
          start: dayjs().startOf('day').toDate(),
          end: null,
          use_google_map: false,
          location: '',
          reference_link: '',
          description: '',
          recurring_rule: '',
          duration_amount: 1,
          duration_unit: 'day' as const
        }
  )

  const ref = useRef<HTMLInputElement>(null)

  const FIELDS: IFieldProps<typeof formState>[] = useMemo(() => {
    const baseFields: IFieldProps<typeof formState>[] = [
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
      }
    ]

    const locationField: IFieldProps<typeof formState> =
      formState.use_google_map
        ? {
            id: 'location',
            required: true,
            type: 'location',
            label: 'Location'
          }
        : {
            id: 'location',
            required: false,
            type: 'text',
            label: 'Location',
            icon: 'tabler:map-pin',
            placeholder: 'Event location'
          }

    const additionalFields: IFieldProps<typeof formState>[] = [
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
    ]

    return [...baseFields, locationField, ...additionalFields]
  }, [
    formState.type,
    categoriesQuery.data,
    calendarsQuery.data,
    formState.use_google_map
  ])

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

export default CreateEventModal
