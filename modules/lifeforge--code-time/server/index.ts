import dayjs from 'dayjs'
import puppeteer from 'puppeteer-core'
import z from 'zod'

import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import forge from './forge'
import schema from './schema'
import getReadmeHTML from './utils/readme'
import { default as _getStatistics } from './utils/statistics'

const getActivities = forge
  .query({
    description: 'Get coding activity calendar by year',
    input: {
      query: z.object({
        year: z.string().optional()
      })
    },
    output: {
      OK: z.object({
        data: z.array(
          z.object({
            date: z.string(),
            count: z.number(),
            level: z.number()
          })
        ),
        firstYear: z.number()
      })
    }
  })
  .callback(async ({ pb, query: { year }, response }) => {
    const yearValue = year ? parseInt(year, 10) : new Date().getFullYear()

    const data = await pb.getFullList
      .collection('daily_entries')
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

    if (data.length === 0) {
      return response.ok({ data: [], firstYear: yearValue })
    }

    const groupByDate = data.reduce(
      (acc, item) => {
        const dateKey = dayjs(item.date).format('YYYY-MM-DD')

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

        const levels = [1, 3, 5, 7, 9]

        return levels.findIndex(threshold => hours < threshold) + 1 || 6
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
      .collection('daily_entries')
      .page(1)
      .perPage(1)
      .sort(['date'])
      .execute()

    return response.ok({
      data: final,
      firstYear: +firstRecordEver.items[0].date.split(' ')[0].split('-')[0]
    })
  })

const getStatistics = forge
  .query({
    description: 'Get overall coding statistics',
    output: {
      OK: z.record(z.string(), z.number())
    }
  })
  .callback(async ({ pb, response }) => response.ok(await _getStatistics(pb)))

const getLastXDays = forge
  .query({
    description: 'Get coding data for last X days',
    input: {
      query: z.object({
        days: z.string()
      })
    },
    output: {
      OK: z.array(
        schema.daily_entries
          .omit({
            languages: true,
            projects: true
          })
          .extend({
            languages: z.record(z.string(), z.number()),
            projects: z.record(z.string(), z.number())
          })
      ),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, query: { days }, response }) => {
    const parsedDays = parseInt(days, 10)

    if (parsedDays > 30) {
      return response.badRequest('days must be less than or equal to 30')
    }

    const lastXDays = dayjs().subtract(parsedDays, 'days').format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${lastXDays} 00:00:00.000Z`
        }
      ])
      .execute()

    return response.ok(data)
  })

const getTopProjects = forge
  .query({
    description: 'Get top projects by time spent',
    input: {
      query: z.object({
        last: z.enum(['24 hours', '7 days', '30 days']).default('7 days')
      })
    },
    output: {
      OK: z.record(z.string(), z.number())
    }
  })
  .callback(async ({ pb, query: { last }, response }) => {
    const params = {
      '24 hours': [24, 'hours'],
      '7 days': [7, 'days'],
      '30 days': [30, 'days']
    }[last]!

    const date = dayjs()
      .subtract(Number(params[0]), params[1] as dayjs.ManipulateType)
      .format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('daily_entries')
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

    return response.ok(groupByProject)
  })

const getTopLanguages = forge
  .query({
    description: 'Get top languages by usage',
    input: {
      query: z.object({
        last: z.enum(['24 hours', '7 days', '30 days']).default('7 days')
      })
    },
    output: {
      OK: z.record(z.string(), z.number())
    }
  })
  .callback(async ({ pb, query: { last }, response }) => {
    const params = {
      '24 hours': [24, 'hours'],
      '7 days': [7, 'days'],
      '30 days': [30, 'days']
    }[last]!

    const date = dayjs()
      .subtract(Number(params[0]), params[1] as dayjs.ManipulateType)
      .format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('daily_entries')
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

    return response.ok(groupByLanguage)
  })

const getEachDay = forge
  .query({
    description: 'Get daily coding time breakdown',
    output: {
      OK: z.array(
        z.object({
          date: z.string(),
          duration: z.number()
        })
      )
    }
  })
  .callback(async ({ pb, response }) => {
    const lastDay = dayjs().format('YYYY-MM-DD')

    const firstDay = dayjs().subtract(30, 'days').format('YYYY-MM-DD')

    const data = await pb.getFullList
      .collection('daily_entries')
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
      const dateKey = dayjs(item.date).format('YYYY-MM-DD')

      groupByDate[dateKey] = item.total_minutes
    }

    return response.ok(
      Object.entries(groupByDate).map(([date, item]) => ({
        date,
        duration: item * 1000 * 60
      }))
    )
  })

const getTimeDistribution = forge
  .query({
    description: 'Get hourly coding time distribution',
    output: {
      OK: z.record(z.string(), z.number())
    }
  })
  .callback(async ({ pb, response }) => {
    const data = await pb.getFullList.collection('daily_entries').execute()

    const hourlyData = data.map(item => item.hourly || {})

    const distribution: { [key: string]: number } = Object.fromEntries(
      Array.from({ length: 24 }, (_, i) => [i.toString(), 0])
    )

    for (const item of hourlyData) {
      for (const hour in item) {
        distribution[hour] += item[hour]
      }
    }

    return response.ok(distribution)
  })

const getUserMinutes = forge
  .query({
    description: 'Get total coding minutes',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {
      query: z.object({
        minutes: z.string()
      })
    },
    output: {
      OK: z.object({
        minutes: z.number()
      })
    }
  })
  .callback(async ({ pb, query: { minutes }, response }) => {
    const parsedMinutes = parseInt(minutes, 10)

    const minTime = dayjs()
      .subtract(parsedMinutes, 'minutes')
      .format('YYYY-MM-DD')

    const items = await pb.getFullList
      .collection('daily_entries')
      .filter([
        {
          field: 'date',
          operator: '>=',
          value: `${minTime} 00:00:00.000Z`
        }
      ])
      .execute()

    return response.ok({
      minutes: items.reduce((acc, item) => acc + item.total_minutes, 0)
    })
  })

const eventLog = forge
  .mutation({
    description: 'Record a coding activity event',
    noAuth: true,
    encrypted: false,
    rateLimit: false,
    input: {
      body: z.object({}).passthrough()
    },
    output: {
      OK: z.object({
        status: z.string(),
        message: z.string()
      })
    }
  })
  .callback(async ({ pb, body: data, response }) => {
    data.eventTime = Math.floor(Date.now() / 60000) * 60000

    const date = dayjs(data.eventTime as string).format('YYYY-MM-DD')

    const lastData = await pb.getList
      .collection('daily_entries')
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
        .collection('daily_entries')
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
          hourly: {
            [dayjs(data.eventTime as string).format('H')]: 1
          },
          total_minutes: 1,
          last_timestamp: data.eventTime
        })
        .execute()
    } else {
      const lastRecord = lastData.items[0]

      if (data.eventTime === lastRecord.last_timestamp) {
        return response.ok({ status: 'ok', message: 'success' })
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

      const hourly = lastRecord.hourly || {}

      const hourKey = dayjs(data.eventTime as string).format('H')

      if (hourly[hourKey]) {
        hourly[hourKey] += 1
      } else {
        hourly[hourKey] = 1
      }

      await pb.update
        .collection('daily_entries')
        .id(lastRecord.id)
        .data({
          projects,
          relative_files: relativeFiles,
          languages,
          hourly,
          total_minutes: lastRecord.total_minutes + 1,
          last_timestamp: data.eventTime
        })
        .execute()
    }

    return response.ok({ status: 'ok', message: 'success' })
  })

const readme = forge
  .query({
    description: 'Generate README stats image',
    noAuth: true,
    encrypted: false,
    output: 'custom'
  })
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

    res.status(200).send(imageBuffer)
  })

const routes = forgeRouter({
  getActivities,
  getStatistics,
  getLastXDays,
  getTopProjects,
  getTopLanguages,
  getEachDay,
  getTimeDistribution,
  user: {
    minutes: getUserMinutes
  },
  eventLog,
  readme
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
