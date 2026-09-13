import z from 'zod'

import forge from '../forge'
import pomodoroTimerSchemas from '../schema'
import fetchOrUpdateSettings from '../utils/fetchOrUpdateSettings'

export const get = forge
  .query({
    description: 'Get user pomodoro settings',
    output: {
      OK: pomodoroTimerSchemas.settings
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(await fetchOrUpdateSettings({ pb }))
  )

export const update = forge
  .mutation({
    description: 'Update pomodoro settings',
    input: {
      body: z.object({
        auto_start_break: z.boolean().optional(),
        auto_start_work: z.boolean().optional(),
        work_color: z.string().optional(),
        short_break_color: z.string().optional(),
        long_break_color: z.string().optional()
      })
    },
    media: {
      notification_sound: {
        optional: true
      }
    },
    output: {
      OK: pomodoroTimerSchemas.settings
    }
  })
  .callback(
    async ({
      body,
      pb,
      media: { notification_sound },
      core: {
        media: { retrieveMedia }
      },
      response
    }) =>
      response.ok(
        await fetchOrUpdateSettings({
          pb,
          overwrite: {
            ...body,
            ...(await retrieveMedia('notification_sound', notification_sound))
          }
        })
      )
  )
