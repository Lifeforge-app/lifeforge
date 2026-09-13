import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { type InferInput } from '@lifeforge/api'
import {
  CheckboxField,
  ColorField,
  FileField,
  type FileValue,
  FormModal,
  createDefaultValues,
  getFormFileFieldInitialData
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { type PomodoroSettings } from '@/providers/PomodoroSettingsProvider'

const schema = z.object({
  work_color: z.string(),
  short_break_color: z.string(),
  long_break_color: z.string(),
  auto_start_break: z.boolean(),
  auto_start_work: z.boolean(),
  notification_sound: z.custom<FileValue>()
})

export default function SettingsModal({
  onClose,
  data: { initialData }
}: {
  onClose: () => void
  data: { initialData: PomodoroSettings }
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    forgeAPI.settings.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: forgeAPI.settings.get.key })
        onClose()
      }
    })
  )
  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData,
      notification_sound: getFormFileFieldInitialData(
        forgeAPI,
        initialData,
        initialData.notification_sound
      )
    },
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        template: 'update',
        handler: async data => {
          await mutation.mutateAsync(
            data as unknown as InferInput<
              typeof forgeAPI.settings.update
            >['body']
          )
        }
      }}
      uiConfig={{
        title: 'Settings',
        namespace: 'apps.pomodoro-timer',
        icon: 'tabler:settings',
        onClose
      }}
    >
      <ColorField control={form.control} label="workColor" name="work_color" />
      <ColorField
        control={form.control}
        label="shortBreakColor"
        name="short_break_color"
      />
      <ColorField
        control={form.control}
        label="longBreakColor"
        name="long_break_color"
      />
      <CheckboxField
        control={form.control}
        icon="tabler:player-stop"
        label="autoStartBreaks"
        name="auto_start_break"
      />
      <CheckboxField
        control={form.control}
        icon="tabler:player-skip-forward"
        label="autoStartWork"
        name="auto_start_work"
      />
      <FileField
        control={form.control}
        icon="tabler:bell"
        label="notificationSound"
        mimeTypes={{ audio: ['mpeg', 'mp3', 'wav', 'ogg', 'webm'] }}
        name="notification_sound"
      />
    </FormModal>
  )
}
