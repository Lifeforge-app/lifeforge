import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
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
  //TODO
  console.log(initialData)

  const calendarsQuery = useQuery(
    forgeAPI.calendar.calendars.list.queryOptions()
  )

  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.calendar.events)[typeof type]>['body']
  >()
    .ui({
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
      recurring_rule: 'text',
      duration_amount: 'number',
      duration_unit: 'listbox'
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
      }
    })
    // .initialData(initialData)
    .onSubmit(async () => {})
    .build()

  return <FormModal {...formProps} />
}

export default ModifyEventModal
