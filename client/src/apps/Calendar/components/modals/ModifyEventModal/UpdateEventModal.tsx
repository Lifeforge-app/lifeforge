import { useQueryClient } from '@tanstack/react-query'
import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAPIQuery } from 'shared/lib'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

function UpdateEventModal({
  data: { existedData },
  onClose
}: {
  data: {
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
    CalendarControllersSchemas.IEvents['updateEvent']['body']
  >({
    title: '',
    category: '',
    calendar: '',
    location: undefined,
    reference_link: '',
    description: ''
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
    if (existedData !== null) {
      setFormState({
        title: existedData.title ?? '',
        category: existedData.category ?? '',
        calendar: existedData.calendar ?? '',
        location: existedData.location
          ? {
              name: existedData.location,
              location: {
                latitude: existedData.location_coords.lat,
                longitude: existedData.location_coords.lon
              },
              formattedAddress: existedData.location
            }
          : undefined,

        reference_link: existedData.reference_link ?? '',
        description: existedData.description ?? ''
      })
    }
  }, [existedData])

  return (
    <FormModal
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
      icon="tabler:pencil"
      id={existedData?.id}
      loading={categoriesQuery.isLoading || calendarsQuery.isLoading}
      modalRef={ref}
      namespace="apps.calendar"
      openType="update"
      queryKey={eventQueryKey}
      setData={setFormState}
      title="event.update"
      onClose={onClose}
    />
  )
}

export default UpdateEventModal
