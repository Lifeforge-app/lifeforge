import fs from 'fs'
import path from 'path'
import z from 'zod'

import pomodoroTimerSchemas from '../schema'

const DEFAULT_SOUND_LOCATION = path.resolve(
  import.meta.dirname,
  '../assets/bell.opus'
)

const DEFAULT_SETTINGS: Omit<
  z.infer<typeof pomodoroTimerSchemas.settings>,
  | 'created'
  | 'updated'
  | 'notification_sound'
  | 'id'
  | 'collectionId'
  | 'collectionName'
> & {
  notification_sound: File
} = {
  work_color: '#fb2c36',
  short_break_color: '#9ae600',
  long_break_color: '#00d3f2',
  auto_start_break: false,
  auto_start_work: false,
  notification_sound: new File(
    [fs.readFileSync(DEFAULT_SOUND_LOCATION)],
    'bell.opus'
  )
}

export default async function fetchOrUpdateSettings({
  pb,
  overwrite
}: {
  pb: any
  overwrite?: Partial<
    Omit<z.infer<typeof pomodoroTimerSchemas.settings>, 'notification_sound'>
  > & {
    notification_sound?: File | null | undefined
  }
}) {
  const settings = await pb.getFirstListItem
    .collection('settings')
    .execute()
    .catch(() => null)

  if (!settings) {
    return pb.create
      .collection('settings')
      .data({
        ...DEFAULT_SETTINGS,
        ...(overwrite || {})
      })
      .execute()
  }

  if (JSON.stringify(overwrite || {}) === '{}') {
    return settings
  }

  return pb.update
    .collection('settings')
    .id(settings.id)
    .data({
      ...(overwrite || {})
    })
    .execute()
}
