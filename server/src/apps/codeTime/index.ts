import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import moment from 'moment'
import puppeteer from 'puppeteer-core'
import { z } from 'zod/v4'

import getReadmeHTML from './utils/readme'
import { default as _getStatistics } from './utils/statistics'

const getActivities = forgeController.query

  .description('Get activities by year')
  .input({
    query: z.object({
      year: z
        .string()
        .optional()
        .transform(val => (val ? parseInt(val, 10) : new Date().getFullYear()))
    })
  })
  .callback(async ({ pb, query: { year } }) => {
    const yearValue = Number(year) || new Date().getFullYear()

    const data = await pb.getFullList
      .collection('code_time__daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${yearValue}-01-01 00:00:00.000Z`
        },
        {
          field: 'date',
          operator: '<=',
          value: `${yearValue}-12-31 23:59:59.999Z`
        }
      ])
      .execute()

    const groupByDate = data.reduce(
      (acc, item) => {
        const dateKey = moment(item.date).format('YYYY-MM-DD')

        acc[dateKey] = item.total_minutes

        return acc
      },
      {} as { [key: string]: number }
    )

    const final = Object.entries(groupByDate).map(([date, totalMinutes]) => ({
      date,
      count: totalMinutes,
      level: (() => {
        const hours = totalMinutes / 60

        if (hours < 1) {
          return 1
        }

        if (hours < 3) {
          return 2
        }

        if (hours < 5) {
          return 3
        }

        return 4
      })()
    }))

    if (final.length > 0 && final[0].date !== `${yearValue}-01-01`) {
      final.unshift({
        date: `${yearValue}-01-01`,
        count: 0,
        level: 0
      })
    }

    if (
      final.length > 0 &&
      final[final.length - 1].date !== `${yearValue}-12-31`
    ) {
      final.push({
        date: `${yearValue}-12-31`,
        count: 0,
        level: 0
      })
    }

    const firstRecordEver = await pb.getList
      .collection('code_time__daily_entries')
      .page(1)
      .perPage(1)
      .sort(['date'])
      .execute()

    return {
      data: final,
      firstYear: +firstRecordEver.items[0].date.split(' ')[0].split('-')[0]
    }
  })

const getStatistics = forgeController.query

  .description('Get code time statistics')
  .input({})
  .callback(({ pb }) => _getStatistics(pb))

const getLastXDays = forgeController.query

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

    const lastXDays = moment().subtract(days, 'days').format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('code_time__daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${lastXDays} 00:00:00.000Z`
        }
      ])
      .execute()

    return data
  })

const getProjects = forgeController.query

  .description('Get projects statistics')
  .input({
    query: z.object({
      last: z.enum(['24 hours', '7 days', '30 days']).default('7 days')
    })
  })
  .callback(async ({ pb, query: { last } }) => {
    const params = {
      '24 hours': [24, 'hours'],
      '7 days': [7, 'days'],
      '30 days': [30, 'days']
    }[last]!

    const date = moment()
      .subtract(params[0], params[1] as moment.unitOfTime.DurationConstructor)
      .format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('code_time__daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${date} 00:00:00.000Z`
        }
      ])
      .execute()

    const projects = data.map(item => item.projects)

    let groupByProject: { [key: string]: number } = {}

    for (const item of projects) {
      for (const project in item) {
        if (!groupByProject[project]) {
          groupByProject[project] = 0
        }
        groupByProject[project] += item[project]
      }
    }

    groupByProject = Object.fromEntries(
      Object.entries(groupByProject).sort(([, a], [, b]) => b - a)
    )

    return groupByProject
  })

const getLanguages = forgeController.query

  .description('Get languages statistics')
  .input({
    query: z.object({
      last: z.enum(['24 hours', '7 days', '30 days']).default('7 days')
    })
  })
  .callback(async ({ pb, query: { last } }) => {
    const params = {
      '24 hours': [24, 'hours'],
      '7 days': [7, 'days'],
      '30 days': [30, 'days']
    }[last]!

    const date = moment()
      .subtract(params[0], params[1] as moment.unitOfTime.DurationConstructor)
      .format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('code_time__daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${date} 00:00:00.000Z`
        }
      ])
      .execute()

    const languages = data.map(item => item.languages)

    let groupByLanguage: { [key: string]: number } = {}

    for (const item of languages) {
      for (const language in item) {
        if (!groupByLanguage[language]) {
          groupByLanguage[language] = 0
        }
        groupByLanguage[language] += item[language]
      }
    }

    groupByLanguage = Object.fromEntries(
      Object.entries(groupByLanguage).sort(([, a], [, b]) => b - a)
    )

    return groupByLanguage
  })

const getEachDay = forgeController.query

  .description('Get each day code time data')
  .input({})
  .callback(async ({ pb }) => {
    const lastDay = moment().format('YYYY-MM-DD')

    const firstDay = moment().subtract(30, 'days').format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('code_time__daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${firstDay} 00:00:00.000Z`
        },
        {
          field: 'date',
          operator: '<=',
          value: `${lastDay} 23:59:59.999Z`
        }
      ])
      .execute()

    const groupByDate: { [key: string]: number } = {}

    for (const item of data) {
      const dateKey = moment(item.date).format('YYYY-MM-DD')

      groupByDate[dateKey] = item.total_minutes
    }

    return Object.entries(groupByDate).map(([date, item]) => ({
      date,
      duration: item * 1000 * 60
    }))
  })

const getUserMinutes = forgeController.query

  .description('Get user minutes')
  .input({
    query: z.object({
      minutes: z.string().transform(val => parseInt(val, 10))
    })
  })
  .callback(async ({ pb, query: { minutes } }) => {
    const minTime = moment().subtract(minutes, 'minutes').format('YYYY-MM-DD')

    const items = await pb.getFullList
      .collection('code_time__daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${minTime} 00:00:00.000Z`
        }
      ])
      .execute()

    return {
      minutes: items.reduce((acc, item) => acc + item.total_minutes, 0)
    }
  })

const eventLog = forgeController.mutation

  .description('Log a code time event')
  .input({
    body: z.object({}).passthrough()
  })
  .callback(async ({ pb, body: data }) => {
    data.eventTime = Math.floor(Date.now() / 60000) * 60000

    const date = moment(data.eventTime as string).format('YYYY-MM-DD')

    const lastData = await pb.getList
      .collection('code_time__daily_entries')
      .page(1)
      .perPage(1)
      .filter([
        {
          field: 'date',
          operator: '~',
          value: date
        }
      ])
      .execute()

    if (lastData.totalItems === 0) {
      await pb.create
        .collection('code_time__daily_entries')
        .data({
          date,
          projects: {
            [data.project as string]: 1
          },
          relative_files: {
            [data.relativeFile as string]: 1
          },
          languages: {
            [data.language as string]: 1
          },
          total_minutes: 1,
          last_timestamp: data.eventTime
        })
        .execute()
    } else {
      const lastRecord = lastData.items[0]

      if (data.eventTime === lastRecord.last_timestamp) {
        return { status: 'ok', message: 'success' }
      }

      const projects = lastRecord.projects

      if (projects[data.project as string]) {
        projects[data.project as string] += 1
      } else {
        projects[data.project as string] = 1
      }

      const relativeFiles = lastRecord.relative_files

      if (relativeFiles[data.relativeFile as string]) {
        relativeFiles[data.relativeFile as string] += 1
      } else {
        relativeFiles[data.relativeFile as string] = 1
      }

      const languages = lastRecord.languages

      if (languages[data.language as string]) {
        languages[data.language as string] += 1
      } else {
        languages[data.language as string] = 1
      }

      await pb.update
        .collection('code_time__daily_entries')
        .id(lastRecord.id)
        .data({
          projects,
          relative_files: relativeFiles,
          languages,
          total_minutes: lastRecord.total_minutes + 1,
          last_timestamp: data.eventTime
        })
        .execute()
    }

    return { status: 'ok', message: 'success' }
  })

const readme = forgeController.query

  .description('Get readme image')
  .input({})
  .noDefaultResponse()
  .callback(async ({ pb, res }) => {
    const html = await getReadmeHTML(pb)

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()

    await page.setViewport({
      width: 1080,
      height: 430
    })
    await page.setContent(html)
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    const imageBuffer = await page.screenshot({ type: 'png' })

    await browser.close()

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.set('Content-Type', 'image/png')

    //@ts-expect-error - Express response type
    res.status(200).send(imageBuffer)
  })

export default forgeRouter({
  getActivities,
  getStatistics,
  getLastXDays,
  getProjects,
  getLanguages,
  getEachDay,
  user: {
    minutes: getUserMinutes
  },
  eventLog,
  readme
})
