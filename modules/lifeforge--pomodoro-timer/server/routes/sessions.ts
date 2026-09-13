import z from 'zod'

import forge from '../forge'
import pomodoroTimerSchemas from '../schema'

export const getById = forge
  .query({
    description: 'Get pomodoro session by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'sessions' }
    },
    output: {
      OK: pomodoroTimerSchemas.sessions_aggregated.extend({
        lastSubSessionType: z.enum(['work', 'short_break', 'long_break'])
      }),
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { id }, pb, response }) => {
    const lastSubSession = await pb.getFirstListItem
      .collection('sub_sessions')
      .filter([{ field: 'session', operator: '=', value: id }])
      .sort(['-created'])
      .execute()
      .catch(() => null)

    return response.ok({
      lastSubSessionType: lastSubSession?.type || 'short_break',
      ...(await pb.getOne.collection('sessions_aggregated').id(id).execute())
    })
  })

export const list = forge
  .query({
    description: 'List all pomodoro sessions',
    output: {
      OK: z.array(pomodoroTimerSchemas.sessions_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('sessions_aggregated')
        .sort(['-created'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new pomodoro session',
    input: {
      body: z.object({
        name: z.string(),
        work_duration: z.number().min(1).max(120),
        short_break_duration: z.number().min(1).max(60),
        long_break_duration: z.number().min(1).max(120),
        session_until_long_break: z.number().min(1).max(10)
      })
    },
    output: {
      CREATED: pomodoroTimerSchemas.sessions
    }
  })
  .callback(
    async ({
      body: {
        name,
        work_duration,
        short_break_duration,
        long_break_duration,
        session_until_long_break
      },
      pb,
      response
    }) =>
      response.created(
        await pb.create
          .collection('sessions')
          .data({
            name,
            work_duration,
            short_break_duration,
            long_break_duration,
            session_until_long_break,
            status: 'new'
          })
          .execute()
      )
  )

export const update = forge
  .mutation({
    description: 'Update a pomodoro session',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        name: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'sessions' }
    },
    output: {
      OK: pomodoroTimerSchemas.sessions,
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { id }, body, pb, response }) =>
    response.ok(
      await pb.update
        .collection('sessions')
        .id(id)
        .data({
          name: body.name
        })
        .execute()
    )
  )

export const changeStatus = forge
  .mutation({
    description: 'Change status of a pomodoro session',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        status: z.enum(['new', 'active', 'completed']),
        subSessions: z
          .array(
            z.object({
              type: z.enum(['work', 'short_break', 'long_break']),
              duration_elapsed: z.number(),
              ended: z.string(),
              is_completed: z.boolean()
            })
          )
          .optional(),
        pomodoroCount: z.number().optional()
      })
    },
    existenceCheck: {
      query: { id: 'sessions' }
    },
    output: {
      OK: pomodoroTimerSchemas.sessions_aggregated,
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      query: { id },
      body: { status, subSessions, pomodoroCount },
      pb,
      response
    }) => {
      if (status === 'completed' && subSessions && subSessions.length > 0) {
        for (const subSession of subSessions) {
          await pb.create
            .collection('sub_sessions')
            .data({
              session: id,
              type: subSession.type,
              duration_elapsed: subSession.duration_elapsed,
              ended: subSession.ended,
              is_completed: subSession.is_completed
            })
            .execute()
        }

        const totalTimeElapsed = subSessions.reduce(
          (sum, s) => sum + s.duration_elapsed,
          0
        )

        await pb.update
          .collection('sessions')
          .id(id)
          .data({
            status,
            total_time_elapsed: totalTimeElapsed,
            pomodoro_count: pomodoroCount ?? 0
          })
          .execute()
      } else {
        await pb.update.collection('sessions').id(id).data({ status }).execute()
      }

      return response.ok(
        await pb.getOne.collection('sessions_aggregated').id(id).execute()
      )
    }
  )

export const remove = forge
  .mutation({
    description: 'Delete a pomodoro session',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'sessions' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { id }, pb, response }) => {
    await pb.delete.collection('sessions').id(id).execute()

    return response.noContent()
  })

export const listSubSessions = forge
  .query({
    description: 'List sub-sessions for a pomodoro session',
    input: {
      query: z.object({
        sessionId: z.string()
      })
    },
    existenceCheck: {
      query: { sessionId: 'sessions' }
    },
    output: {
      OK: z.array(pomodoroTimerSchemas.sub_sessions),
      NOT_FOUND: true
    }
  })
  .callback(async ({ query: { sessionId }, pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('sub_sessions')
        .filter([{ field: 'session', operator: '=', value: sessionId }])
        .sort(['created'])
        .execute()
    )
  )
