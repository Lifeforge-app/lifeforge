import ClientError from '@functions/ClientError'
import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import * as CodeTimeService from '../services/codeTime.service'

const getActivities = forgeController
  .route('GET /activities')
  .description('Get activities by year')
  .input({
    query: z.object({
      year: z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val, 10) : new Date().getFullYear()))
    })
  })
  .callback(
    async ({ pb, query: { year } }) =>
      await CodeTimeService.getActivities(pb, year)
  )

const getStatistics = forgeController
  .route('GET /statistics')
  .description('Get code time statistics')
  .input({})
  .callback(async ({ pb }) => await CodeTimeService.getStatistics(pb))

const getLastXDays = forgeController
  .route('GET /last-x-days')
  .description('Get last X days of code time data')
  .input({
    query: z.object({
      days: z.string().transform(val => parseInt(val, 10))
    })
  })
  .callback(async ({ pb, query: { days } }) => {
    if (days > 30) {
      throw new ClientError('days must be less than or equal to 30')
    }

    return await CodeTimeService.getLastXDays(pb, days)
  })

const getProjects = forgeController
  .route('GET /projects')
  .description('Get projects statistics')
  .input({
    query: z.object({
      last: z.enum(['24 hours', '7 days', '30 days']).default('7 days')
    })
  })
  .callback(
    async ({ pb, query: { last } }) =>
      await CodeTimeService.getProjectsStats(pb, last)
  )

const getLanguages = forgeController
  .route('GET /languages')
  .description('Get languages statistics')
  .input({
    query: z.object({
      last: z.enum(['24 hours', '7 days', '30 days']).default('7 days')
    })
  })
  .callback(
    async ({ pb, query: { last } }) =>
      await CodeTimeService.getLanguagesStats(pb, last)
  )

const getEachDay = forgeController
  .route('GET /each-day')
  .description('Get each day code time data')
  .input({})
  .callback(async ({ pb }) => await CodeTimeService.getEachDay(pb))

const getUserMinutes = forgeController
  .route('GET /user/minutes')
  .description('Get user minutes')
  .input({
    query: z.object({
      minutes: z.string().transform(val => parseInt(val, 10))
    })
  })
  .callback(
    async ({ pb, query: { minutes } }) =>
      await CodeTimeService.getUserMinutes(pb, minutes)
  )

const logEvent = forgeController
  .route('POST /eventLog')
  .description('Log a code time event')
  .input({
    body: z.object({}).passthrough()
  })
  .callback(async ({ pb, body }) => {
    await CodeTimeService.logEvent(pb, body)

    return {
      status: 'ok',
      data: [],
      message: 'success'
    }
  })

const getReadmeImage = forgeController
  .route('GET /readme')
  .description('Get readme image')
  .input({})
  .noDefaultResponse()
  .callback(async ({ pb, res }) => {
    const imageBuffer = await CodeTimeService.getReadmeImage(pb)

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Content-Type', 'image/png')

    // @ts-expect-error - Custom response
    res.status(200).send(imageBuffer)
  })

export default forgeRouter({
  getActivities,
  getStatistics,
  getLastXDays,
  getProjects,
  getLanguages,
  getEachDay,
  getUserMinutes,
  logEvent,
  getReadmeImage
})
