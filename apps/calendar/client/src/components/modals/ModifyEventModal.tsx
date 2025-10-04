import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'

import type { CalendarEvent } from '../Calendar'

function ModifyEventModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<CalendarEvent>
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const calendarsQuery = useQuery(
    forgeAPI.calendar.calendars.list.queryOptions()
  )

  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
  )

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.calendar.events.create
      : forgeAPI.calendar.events.update.input({
          id: initialData?.id?.split('-')[0] || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['calendar'] })
      },
      onError: error => {
        toast.error(`Error modifying event: ${error.message}`)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.calendar.events)[typeof type]>['body']
  >({
    icon: {
      create: 'tabler:plus',
      update: 'tabler:pencil'
    }[type!],
    title: `event.${type}`,
    namespace: 'apps.calendar',
    onClose,
    loading: categoriesQuery.isLoading || calendarsQuery.isLoading,
    submitButton: type
  })
    .typesMap({
      title: 'text',
      category: 'listbox',
      calendar: 'listbox',
      location: 'location',
      reference_link: 'text',
      description: 'textarea',
      type: 'listbox',
      start: 'datetime',
      end: 'datetime',
      rrule: 'rrule'
    })
    .setupFields({
      title: {
        required: true,
        label: 'Event title',
        icon: 'tabler:calendar',
        placeholder: 'My event'
      },
      category: {
        multiple: false,
        required: true,
        label: 'Event Category',
        icon: 'tabler:list',
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
      calendar: {
        multiple: false,
        label: 'Calendar',
        icon: 'tabler:calendar',
        options: calendarsQuery.isSuccess
          ? calendarsQuery.data?.map(({ name, color, id }) => ({
              value: id,
              text: name,
              color
            }))
          : [],
        nullOption: ''
      },
      location: {
        label: 'Location'
      },
      reference_link: {
        required: false,
        label: 'Reference link',
        icon: 'tabler:link',
        placeholder: 'https://example.com'
      },
      description: {
        required: false,
        label: 'Description',
        icon: 'tabler:file-text',
        placeholder: 'Event description'
      },
      type: {
        multiple: false,
        label: 'Event Type',
        required: true,
        icon: 'tabler:calendar',
        options: [
          { value: 'single', text: 'Single Event', icon: 'tabler:calendar' },
          { value: 'recurring', text: 'Recurring Event', icon: 'tabler:repeat' }
        ],
        disabled: type === 'update'
      },
      rrule: {
        required: true,
        hasDuration: true,
        label: 'Recurring Rule'
      },
      start: {
        hasTime: true,
        label: 'Start Time',
        icon: 'tabler:clock'
      },
      end: {
        hasTime: true,
        label: 'End Time',
        icon: 'tabler:clock'
      }
    })
    .initialData(
      (() => {
        if (!initialData) return {}

        const base: Record<string, any> = {
          title: initialData.title,
          category: initialData.category,
          calendar: initialData.calendar,
          location: {
            name: initialData.location || '',
            location: {
              longitude: initialData.location_coords?.lon || 0,
              latitude: initialData.location_coords?.lat || 0
            },
            formattedAddress: initialData.location || ''
          },
          reference_link: initialData.reference_link,
          description: initialData.description,
          type: initialData.type
        }

        if (initialData.type === 'recurring') {
          base.rrule = initialData.rrule
        } else {
          base.start = initialData.start
            ? dayjs(initialData.start).toDate()
            : null
          base.end = initialData.end ? dayjs(initialData.end).toDate() : null
        }

        return base
      })()
    )
    .conditionalFields({
      rrule: data => data.type === 'recurring',
      start: data => data.type === 'single',
      end: data => data.type === 'single'
    })
    .onSubmit(async data => {
      if (data.type === 'recurring') {
        const finalData: InferInput<
          (typeof forgeAPI.calendar.events)[typeof type]
        >['body'] = {
          title: data.title,
          category: data.category,
          calendar: data.calendar,
          location: data.location,
          reference_link: data.reference_link,
          description: data.description,
          type: data.type,
          rrule: data.rrule
        }

        await mutation.mutateAsync(finalData)
      } else {
        const finalData: InferInput<
          (typeof forgeAPI.calendar.events)[typeof type]
        >['body'] = {
          title: data.title,
          category: data.category,
          calendar: data.calendar,
          location: data.location,
          reference_link: data.reference_link,
          description: data.description,
          type: data.type,
          start: data.start,
          end: data.end
        }

        await mutation.mutateAsync(finalData)
      }
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyEventModal
