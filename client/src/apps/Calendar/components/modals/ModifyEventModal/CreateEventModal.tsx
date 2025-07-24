import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAPIQuery } from 'shared'

import {
  CalendarCollectionsSchemas,
  LocationsCustomSchemas
} from 'shared/types/collections'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import EventTimeSelector from './components/EventTimeSelector'

export type ICreateEventFormState = Omit<
  CalendarCollectionsSchemas.IEvent,
  'location' | 'location_coords'
> & {
  location: LocationsCustomSchemas.ILocation | undefined
} & Omit<
    CalendarCollectionsSchemas.IEventsSingle &
      CalendarCollectionsSchemas.IEventsRecurring,
    'base_event' | 'exceptions' | 'start' | 'end'
  > & {
    start: Date | null
    end: Date | null
  }

function CreateEventModal({
  onClose,
  data: { existedData }
}: {
  onClose: () => void
  data: { existedData?: Partial<ICreateEventFormState> }
}) {
  const queryClient = useQueryClient()

  const calendarsQuery = useAPIQuery<
    CalendarControllersSchemas.ICalendars['getAllCalendars']['response']
  >('calendar/calendars', ['calendar', 'calendars'])

  const categoriesQuery = useAPIQuery<
    CalendarControllersSchemas.ICategories['getAllCategories']['response']
  >('calendar/categories', ['calendar', 'categories'])

  const { eventQueryKey } = useCalendarStore()

  const [formState, setFormState] = useState<ICreateEventFormState>({
    type: 'single',
    title: '',
    category: '',
    calendar: '',
    start: dayjs().startOf('day').toDate(),
    end: undefined,
    location: undefined,
    reference_link: '',
    description: '',
    recurring_rule: '',
    duration_amount: 1,
    duration_unit: 'day' as const
  })

  const ref = useRef<HTMLInputElement>(null)

  const FIELDS: IFieldProps<typeof formState>[] = useMemo(
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
        id: 'location',
        required: true,
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
    [categoriesQuery.data, calendarsQuery.data]
  )

  useEffect(() => {
    console.log(existedData)
    setFormState({
      type: 'single',
      title: '',
      category: '',
      calendar: '',
      start: dayjs().startOf('day').toDate(),
      end: undefined,
      location: undefined,
      reference_link: '',
      description: '',
      recurring_rule: '',
      duration_amount: 1,
      duration_unit: 'day',
      ...existedData
    })
  }, [existedData])

  return (
    <FormModal
      additionalFields={
        <EventTimeSelector formState={formState} setFormState={setFormState} />
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
        const finalData: Omit<Partial<typeof originalData>, 'start' | 'end'> & {
          start?: Date | string | null
          end?: Date | string | null
        } = originalData

        if (finalData.type === 'single') {
          delete finalData.recurring_rule
          delete finalData.duration_amount
          delete finalData.duration_unit
        } else if (finalData.type === 'recurring') {
          delete finalData.start
          delete finalData.end
        }

        return finalData
      }}
      icon="tabler:plus"
      loading={categoriesQuery.isLoading || calendarsQuery.isLoading}
      modalRef={ref}
      namespace="apps.calendar"
      openType="create"
      queryKey={eventQueryKey}
      setData={setFormState}
      title="event.create"
      onClose={onClose}
    />
  )
}

export default CreateEventModal
