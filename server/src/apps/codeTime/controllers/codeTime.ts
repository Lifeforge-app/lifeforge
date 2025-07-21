import ClientError from '@functions/ClientError'
import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { CodeTimeControllersSchemas } from 'shared/types/controllers'

import * as CodeTimeService from '../services/codeTime.service'

const getActivities = forgeController
  .route('GET /activities')
  .description('Get activities by year')
  .schema(CodeTimeControllersSchemas.CodeTime.getActivities)
  .callback(
    async ({ pb, query: { year } }) =>
      await CodeTimeService.getActivities(pb, year)
  )

const getStatistics = forgeController
  .route('GET /statistics')
  .description('Get code time statistics')
  .schema(CodeTimeControllersSchemas.CodeTime.getStatistics)
  .callback(async ({ pb }) => await CodeTimeService.getStatistics(pb))

const getLastXDays = forgeController
  .route('GET /last-x-days')
  .description('Get last X days of code time data')
  .schema(CodeTimeControllersSchemas.CodeTime.getLastXDays)
  .callback(async ({ pb, query: { days } }) => {
    if (days > 30) {
      throw new ClientError('days must be less than or equal to 30')
    }

    return await CodeTimeService.getLastXDays(pb, days)
  })

const getProjects = forgeController
  .route('GET /projects')
  .description('Get projects statistics')
  .schema(CodeTimeControllersSchemas.CodeTime.getProjects)
  .callback(
    async ({ pb, query: { last } }) =>
      await CodeTimeService.getProjectsStats(pb, last)
  )

const getLanguages = forgeController
  .route('GET /languages')
  .description('Get languages statistics')
  .schema(CodeTimeControllersSchemas.CodeTime.getLanguages)
  .callback(
    async ({ pb, query: { last } }) =>
      await CodeTimeService.getLanguagesStats(pb, last)
  )

const getEachDay = forgeController
  .route('GET /each-day')
  .description('Get each day code time data')
  .schema(CodeTimeControllersSchemas.CodeTime.getEachDay)
  .callback(async ({ pb }) => await CodeTimeService.getEachDay(pb))

const getUserMinutes = forgeController
  .route('GET /user/minutes')
  .description('Get user minutes')
  .schema(CodeTimeControllersSchemas.CodeTime.getUserMinutes)
  .callback(
    async ({ pb, query: { minutes } }) =>
      await CodeTimeService.getUserMinutes(pb, minutes)
  )

const logEvent = forgeController
  .route('POST /eventLog')
  .description('Log a code time event')
  .schema(CodeTimeControllersSchemas.CodeTime.logEvent as any)
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
  .schema(CodeTimeControllersSchemas.CodeTime.getReadmeImage)
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
