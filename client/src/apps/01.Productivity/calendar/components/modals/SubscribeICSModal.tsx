import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { z } from 'zod'

function SubscribeICSModal({
  onClose,
  data: { onSubmit }
}: {
  onClose: () => void
  data: {
    onSubmit: (icsUrl: string) => void
  }
}) {
  const { formProps } = defineForm<{
    icsUrl: string
  }>({
    icon: 'tabler:calendar-code',
    title: 'Subscribe to ICS calendar',
    onClose,
    namespace: 'apps.calendar',
    submitButton: {
      children: 'proceed',
      iconPosition: 'end',
      icon: 'tabler:arrow-right'
    }
  })
    .typesMap({
      icsUrl: 'text'
    })
    .setupFields({
      icsUrl: {
        required: true,
        label: 'ICS URL',
        icon: 'tabler:link',
        placeholder: 'https://example.com/calendar.ics',
        validator: z.url('Invalid URL')
      }
    })
    .onSubmit(async data => {
      const isValid = await forgeAPI.calendar.calendars.validateICS.mutate({
        icsUrl: data.icsUrl
      })

      if (!isValid) {
        toast.error('The provided ICS URL is invalid or unreachable.')

        throw new Error('Invalid ICS URL')
      }

      onSubmit(data.icsUrl)
    })
    .build()

  return <FormModal {...formProps} />
}

export default SubscribeICSModal
