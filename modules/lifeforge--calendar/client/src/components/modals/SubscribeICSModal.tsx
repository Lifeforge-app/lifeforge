import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { FormModal, TextField, createDefaultValues, toast } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

const schema = z.object({
  icsUrl: z.url('Must be a valid URL')
})

function SubscribeICSModal({
  onClose,
  data: { onSubmit }
}: {
  onClose: () => void
  data: {
    onSubmit: (icsUrl: string) => void
  }
}) {
  const form = useForm({
    defaultValues: createDefaultValues(schema),
    mode: 'all',
    resolver: zodResolver(schema)
  })

  async function handleSubmit(data: z.infer<typeof schema>) {
    const isValid = await forgeAPI.calendars.validateICS.mutate({
      icsUrl: data.icsUrl
    })

    if (!isValid) {
      toast.error('The provided ICS URL is invalid or unreachable.')

      throw new Error('Invalid ICS URL')
    }

    onSubmit(data.icsUrl)
  }

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: handleSubmit,
        icon: 'tabler:arrow-right',
        label: 'proceed'
      }}
      uiConfig={{
        icon: 'tabler:calendar-code',

        title: 'Subscribe to ICS calendar',
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:link"
        label="ICS URL"
        name="icsUrl"
        placeholder="https://example.com/calendar.ics"
      />
    </FormModal>
  )
}

export default SubscribeICSModal
