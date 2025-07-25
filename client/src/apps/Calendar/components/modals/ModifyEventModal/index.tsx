import { useQuery, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { type FormFieldConfig, FormModal } from 'lifeforge-ui'

import { useCalendarStore } from '@apps/Calendar/stores/useCalendarStore'

import type { CalendarEvent } from '../../Calendar'

function ModifyEventModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData?: Partial<CalendarEvent>
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

  const { start, end } = useCalendarStore()

  const FIELDS = {
    title: {
      required: true,
      label: 'Event title',
      icon: 'tabler:calendar',
      type: 'text',
      placeholder: 'My event'
    },
    category: {
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
    calendar: {
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
    location: {
      type: 'location',
      label: 'Location'
    },
    reference_link: {
      required: false,
      label: 'Reference link',
      icon: 'tabler:link',
      type: 'text',
      placeholder: 'https://example.com'
    },
    description: {
      required: false,
      label: 'Description',
      icon: 'tabler:file-text',
      type: 'textarea',
      placeholder: 'Event description'
    }
  } as const satisfies FormFieldConfig<
    InferInput<typeof forgeAPI.calendar.events.create>['body']
  >

  async function onSubmit(
    data: Partial<InferInput<typeof forgeAPI.calendar.events.create>['body']>
  ) {}

  return (
    <FormModal
      form={{
        fields: FIELDS,
        onSubmit
      }}
      submitButton={type}
      ui={{
        icon: {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!],
        title: `event.${type}`,
        namespace: 'apps.calendar',
        onClose,
        loading: categoriesQuery.isLoading || calendarsQuery.isLoading
      }}
    />
  )
}

export default ModifyEventModal
