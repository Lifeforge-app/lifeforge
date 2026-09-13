import type { Session } from '@'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import z from 'zod'

import type { InferInput } from '@lifeforge/api'
import {
  FormModal,
  SliderField,
  TextField,
  createDefaultValues,
  toast
} from '@lifeforge/ui'

import DEFAULT_OPTIONS from '@/constants/default_durations'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1),
  work_duration: z.number(),
  short_break_duration: z.number(),
  long_break_duration: z.number(),
  session_until_long_break: z.number()
})

function ModifySessionModal({
  onClose,
  data: { openType, initialData }
}: {
  onClose: () => void
  data: {
    openType: 'create' | 'update'
    initialData?: Session
  }
}) {
  const qc = useQueryClient()

  const mutation = useMutation(
    (openType === 'create'
      ? forgeAPI.sessions.create
      : forgeAPI.sessions.update.input({ id: initialData?.id || '' })
    ).mutationOptions({
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: forgeAPI.sessions.list.key }),
      onError: error => {
        console.error('Error submitting form:', error)
        toast.error('An error occurred while submitting the form.')
      }
    })
  )
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData,
      name:
        initialData?.name || `Productive Session on ${dayjs().format('MMM D')}`,
      work_duration: initialData?.work_duration || DEFAULT_OPTIONS.work,
      short_break_duration:
        initialData?.short_break_duration || DEFAULT_OPTIONS.short_break,
      long_break_duration:
        initialData?.long_break_duration || DEFAULT_OPTIONS.long_break,
      session_until_long_break:
        initialData?.session_until_long_break ||
        DEFAULT_OPTIONS.session_until_long_break
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: openType,
        handler: async values => {
          await mutation.mutateAsync(
            values as InferInput<typeof forgeAPI.sessions.create>['body']
          )
        }
      }}
      uiConfig={{
        icon: openType === 'create' ? 'tabler:plus' : 'tabler:pencil',
        title: `session.${openType}`,
        onClose,
        namespace: 'apps.pomodoro-timer'
      }}
    >
      <TextField
        autoFocus
        required
        control={form.control}
        icon="tabler:tag"
        label="Session Name"
        name="name"
        placeholder="My Productive Session"
      />
      <SliderField
        control={form.control}
        hidden={openType === 'update'}
        icon="tabler:flame"
        label="Work Duration"
        max={120}
        min={1}
        name="work_duration"
      />
      <SliderField
        control={form.control}
        hidden={openType === 'update'}
        icon="tabler:coffee"
        label="Short Break Duration"
        max={60}
        min={1}
        name="short_break_duration"
      />
      <SliderField
        control={form.control}
        hidden={openType === 'update'}
        icon="tabler:beach"
        label="Long Break Duration"
        max={120}
        min={1}
        name="long_break_duration"
      />
      <SliderField
        control={form.control}
        hidden={openType === 'update'}
        icon="tabler:rotate-clockwise-2"
        label="Sessions Until Long Break"
        max={10}
        min={1}
        name="session_until_long_break"
      />
    </FormModal>
  )
}

export default ModifySessionModal
