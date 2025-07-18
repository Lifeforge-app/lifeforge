import { WithPB } from '@typescript/pocketbase_interfaces'
import moment from 'moment'
import PocketBase from 'pocketbase'
import puppeteer from 'puppeteer-core'

import { CodeTimeCollectionsSchemas } from 'shared/types/collections'

export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date.valueOf())

  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export const getDates = (startDate: Date, stopDate: Date): Date[] => {
  const dateArray = []

  let currentDate = startDate
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }
  return dateArray
}

export const getActivities = async (
  pb: PocketBase,
  year?: number
): Promise<CodeTimeCollectionsSchemas.ICodeTimeActivities> => {
  const yearValue = Number(year) || new Date().getFullYear()

  const data = await pb
    .collection('code_time__daily_entries')
    .getFullList<WithPB<CodeTimeCollectionsSchemas.IDailyEntry>>({
      filter: `date >= "${yearValue}-01-01 00:00:00.000Z" && date <= "${yearValue}-12-31 23:59:59.999Z"`
    })

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

  const firstRecordEver = await pb
    .collection('code_time__daily_entries')
    .getList<WithPB<CodeTimeCollectionsSchemas.IDailyEntry>>(1, 1, {
      sort: '+date'
    })

  return {
    data: final,
    firstYear: +firstRecordEver.items[0].date.split(' ')[0].split('-')[0]
  }
}

export const getStatistics = async (
  pb: PocketBase
): Promise<CodeTimeCollectionsSchemas.ICodeTimeStatistics> => {
  const everything = await pb
    .collection('code_time__daily_entries')
    .getFullList({
      sort: 'date'
    })

  let groupByDate: { date: string; count: number }[] = []

  const dateMap: { [key: string]: number } = {}

  for (const item of everything) {
    const dateKey = moment(item.date).format('YYYY-MM-DD')

    dateMap[dateKey] = item.total_minutes
  }

  groupByDate = Object.entries(dateMap).map(([date, count]) => ({
    date,
    count
  }))

  groupByDate = groupByDate.sort((a, b) => {
    if (a.count > b.count) {
      return -1
    }
    if (a.count < b.count) {
      return 1
    }
    return 0
  })

  const mostTimeSpent = groupByDate.length > 0 ? groupByDate[0].count : 0

  const total = everything.reduce((acc, curr) => acc + curr.total_minutes, 0)

  const average = groupByDate.length > 0 ? total / groupByDate.length : 0

  groupByDate = groupByDate.sort((a, b) => a.date.localeCompare(b.date))

  const allDates = groupByDate.map(item => item.date)

  const longestStreak = (() => {
    if (allDates.length === 0) return 0

    let streak = 0
    let longest = 0

    const firstDate = new Date(allDates[0])

    const lastDate = new Date(allDates[allDates.length - 1])

    const dates = getDates(firstDate, lastDate)

    for (const date of dates) {
      const dateKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      if (allDates.includes(dateKey)) {
        streak += 1
      } else {
        if (streak > longest) {
          longest = streak
        }
        streak = 0
      }
    }

    return longest
  })()

  const currentStreak = (() => {
    if (allDates.length === 0) return 0

    let streak = 0

    const firstDate = new Date(allDates[0])

    const lastDate = new Date(allDates[allDates.length - 1])

    const dates = getDates(firstDate, lastDate).reverse()

    for (const date of dates) {
      const dateKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

      if (!allDates.includes(dateKey)) break

      streak += 1
    }

    return streak
  })()

  return {
    'Most time spent': mostTimeSpent,
    'Total time spent': total,
    'Average time spent': average,
    'Longest streak': Math.max(longestStreak, currentStreak),
    'Current streak': currentStreak
  }
}

export const getLastXDays = async (
  pb: PocketBase,
  days: number
): Promise<WithPB<CodeTimeCollectionsSchemas.IDailyEntry>[]> => {
  const lastXDays = moment().subtract(days, 'days').format('YYYY-MM-DD')

  const data = await pb
    .collection('code_time__daily_entries')
    .getFullList<WithPB<CodeTimeCollectionsSchemas.IDailyEntry>>({
      filter: `date >= "${lastXDays} 00:00:00.000Z"`
    })

  return data
}

export const getProjectsStats = async (
  pb: PocketBase,
  lastXDays: '24 hours' | '7 days' | '30 days'
): Promise<{ [key: string]: number }> => {
  const params = {
    '24 hours': [24, 'hours'],
    '7 days': [7, 'days'],
    '30 days': [30, 'days']
  }[lastXDays]!

  const date = moment()
    .subtract(params[0], params[1] as moment.unitOfTime.DurationConstructor)
    .format('YYYY-MM-DD')

  const data = await pb.collection('code_time__daily_entries').getFullList({
    filter: `date >= "${date} 00:00:00.000Z"`
  })

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
}

export const getLanguagesStats = async (
  pb: PocketBase,
  lastXDays: '24 hours' | '7 days' | '30 days'
): Promise<{ [key: string]: number }> => {
  const params = {
    '24 hours': [24, 'hours'],
    '7 days': [7, 'days'],
    '30 days': [30, 'days']
  }[lastXDays]!

  const date = moment()
    .subtract(params[0], params[1] as moment.unitOfTime.DurationConstructor)
    .format('YYYY-MM-DD')

  const data = await pb.collection('code_time__daily_entries').getFullList({
    filter: `date >= "${date} 00:00:00.000Z"`
  })

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
}

export const getEachDay = async (
  pb: PocketBase
): Promise<{ date: string; duration: number }[]> => {
  const lastDay = moment().format('YYYY-MM-DD')

  const firstDay = moment().subtract(30, 'days').format('YYYY-MM-DD')

  const data = await pb
    .collection('code_time__daily_entries')
    .getFullList<WithPB<CodeTimeCollectionsSchemas.IDailyEntry>>({
      filter: `date >= "${firstDay} 00:00:00.000Z" && date <= "${lastDay} 23:59:59.999Z"`
    })

  const groupByDate: { [key: string]: number } = {}

  for (const item of data) {
    const dateKey = moment(item.date).format('YYYY-MM-DD')

    groupByDate[dateKey] = item.total_minutes
  }

  return Object.entries(groupByDate).map(([date, item]) => ({
    date,
    duration: item * 1000 * 60
  }))
}

export const getUserMinutes = async (
  pb: PocketBase,
  minutes: number
): Promise<{ minutes: number }> => {
  const minTime = moment().subtract(minutes, 'minutes').format('YYYY-MM-DD')

  const items = await pb
    .collection('code_time__daily_entries')
    .getFullList<WithPB<CodeTimeCollectionsSchemas.IDailyEntry>>({
      filter: `date >= "${minTime}"`
    })

  return {
    minutes: items.reduce((acc, item) => acc + item.total_minutes, 0)
  }
}

export const logEvent = async (
  pb: PocketBase,
  data: any
): Promise<{ status: string; message: string }> => {
  data.eventTime = Math.floor(Date.now() / 60000) * 60000

  const date = moment(data.eventTime).format('YYYY-MM-DD')

  const lastData = await pb
    .collection('code_time__daily_entries')
    .getList(1, 1, {
      filter: `date~"${date}"`
    })

  if (lastData.totalItems === 0) {
    await pb.collection('code_time__daily_entries').create({
      date,
      projects: {
        [data.project]: 1
      },
      relative_files: {
        [data.relativeFile]: 1
      },
      languages: {
        [data.language]: 1
      },
      total_minutes: 1,
      last_timestamp: data.eventTime
    })
  } else {
    const lastRecord = lastData.items[0]

    if (data.eventTime === lastRecord.last_timestamp) {
      return { status: 'ok', message: 'success' }
    }

    const projects = lastRecord.projects

    if (projects[data.project]) {
      projects[data.project] += 1
    } else {
      projects[data.project] = 1
    }

    const relativeFiles = lastRecord.relative_files

    if (relativeFiles[data.relativeFile]) {
      relativeFiles[data.relativeFile] += 1
    } else {
      relativeFiles[data.relativeFile] = 1
    }

    const languages = lastRecord.languages

    if (languages[data.language]) {
      languages[data.language] += 1
    } else {
      languages[data.language] = 1
    }

    await pb.collection('code_time__daily_entries').update(lastRecord.id, {
      projects,
      relative_files: relativeFiles,
      languages,
      total_minutes: lastRecord.total_minutes + 1,
      last_timestamp: data.eventTime
    })
  }

  return { status: 'ok', message: 'success' }
}

export const getReadmeImage = async (
  pb: PocketBase
): Promise<Uint8Array<ArrayBufferLike>> => {
  const statistics = await getStatistics(pb)

  const today = moment().format('YYYY-MM-DD')

  const todayRecord = await pb
    .collection('code_time__daily_entries')
    .getList(1, 1, {
      filter: `date="${today} 00:00:00.000Z"`
    })

  const todayData = todayRecord.items[0]

  const todayTime = todayData ? todayData.total_minutes : 0

  const html = `
      <!DOCTYPE html>
  <html>
  
  <head>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet" />
    <style>
      * {
        font-family: "Onest", sans-serif;
      }
        
      .border-lime {
        border-color: #cedd3e !important;
      }

      .bg-lime {
        background-color: #cedd3e;
      }

      .text-lime {
        color: #cedd3e;
      }
    </style>
  </head>
  
  <body class="flex p-4 text-zinc-100 flex-col w-full h-dvh border-lime border-2 bg-zinc-900">
    <header class="border-b-2 border-zinc-800 p-2 w-full flex items-center justify-between">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lime">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m7 8l-4 4l4 4m10-8l4 4l-4 4M14 4l-4 16" />
        </svg>
        <h1 class="text-lg font-medium">Code Time Statistics</h1>
      </div>
      <div class="tracking-wider font-medium text-sm flex items-center gap-1">
        <span class="text-zinc-500">powered by</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-lime">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="m11.414 10l-7.383 7.418a2.09 2.09 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0L14.414 13m3.707 2.293l2.586-2.586a1 1 0 0 0 0-1.414l-7.586-7.586a1 1 0 0 0-1.414 0L9.121 6.293a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0" />
        </svg>
        <span>Lifeforge<span class="text-lime">.</span></span>
      </div>
    </header>
    <div class="flex-1 w-full space-y-2 mt-4">
      <div class="bg-lime w-full p-2 flex items-center justify-between rounded-sm text-zinc-900">
        <div class="flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9 0l3 2m-3-7v5" />
          </svg>
          Total Time Spent
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment.duration(statistics['Total time spent'], 'minutes').asHours()
          )}<span class="text-lime-800 text-xl">h</span> ${Math.floor(
            moment
              .duration(statistics['Total time spent'], 'minutes')
              .asMinutes() % 60
          )}<span
              class="text-lime-800 text-xl">m</span></span>
        </div>
      </div>
      <div
        class="bg-zinc-800/50 border-lime border-2 text-lime w-full p-2 flex items-center justify-between rounded-sm">
        <div class="flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12a9 9 0 0 0 5.998 8.485M21 12a9 9 0 1 0-18 0m9-5v5m0 3h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2m3-6v2a1 1 0 0 0 1 1h1m1-3v6" />
          </svg>
          Time Spent Today
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment.duration(todayTime, 'minutes').asHours()
          )}<span class="text-zinc-600 text-xl">h</span> ${Math.floor(
            moment.duration(todayTime, 'minutes').asMinutes() % 60
          )}<span
              class="text-zinc-600 text-xl">m</span></span>
        </div>
      </div>
      <div class="bg-zinc-800/50 w-full p-2 flex items-center justify-between rounded-sm">
        <div class="flex items-center text-zinc-400 gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path
                d="M3 14c.83.642 2.077 1.017 3.5 1c1.423.017 2.67-.358 3.5-1s2.077-1.017 3.5-1c1.423-.017 2.67.358 3.5 1M8 3a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2m4-4a2.4 2.4 0 0 0-1 2a2.4 2.4 0 0 0 1 2" />
              <path d="M3 10h14v5a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" />
              <path d="M16.746 16.726a3 3 0 1 0 .252-5.555" />
            </g>
          </svg>
          Most Time Spent per Day
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment.duration(statistics['Most time spent'], 'minutes').asHours()
          )}<span class="text-zinc-600 text-xl">h</span> ${Math.floor(
            moment
              .duration(statistics['Most time spent'], 'minutes')
              .asMinutes() % 60
          )}<span
              class="text-zinc-600 text-xl">m</span></span>
        </div>
      </div>
      <div class="bg-zinc-800/50 w-full p-2 flex items-center justify-between rounded-sm">
        <div class="flex items-center text-zinc-400 gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path d="M5 13a7 7 0 1 0 14 0a7 7 0 0 0-14 0m2-9L4.25 6M17 4l2.75 2" />
              <path d="M8 13h1l2 3l2-6l2 3h1" />
            </g>
          </svg>
          Average Time Spent per Day
        </div>
        <div>
          <span class="text-2xl font-semibold tracking-wider">${Math.floor(
            moment
              .duration(statistics['Average time spent'], 'minutes')
              .asHours()
          )}<span class="text-zinc-600 text-xl">h</span> ${Math.floor(
            moment
              .duration(statistics['Average time spent'], 'minutes')
              .asMinutes() % 60
          )}<span
              class="text-zinc-600 text-xl">m</span></span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="bg-zinc-800/50 w-full p-2 flex items-center justify-between rounded-sm">
          <div class="flex items-center text-zinc-400 gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M10 2c0-.88 1.056-1.331 1.692-.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08.174l.012.003c.625.133 1.203-.43 2.303-2.173l.14-.224a1 1 0 0 1 1.582-.153C18.733 9.46 20 12.402 20 14.295C20 18.56 16.409 22 12 22s-8-3.44-8-7.706c0-2.252 1.022-4.716 2.632-6.301l.605-.589c.241-.236.434-.43.618-.624C9.285 5.268 10 3.856 10 2"  />
              </g>
            </svg>
            Current Streak
          </div>
          <div>
            <span class="text-2xl font-semibold tracking-wider">${
              statistics['Current streak']
            }<span
                class="text-zinc-600 text-xl ml-1">days</span></span>
          </div>
        </div>
        <div class="bg-zinc-800/50 w-full p-2 flex items-center justify-between rounded-sm">
          <div class="flex items-center text-zinc-400 gap-2 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="text-lime">
              <path fill="currentColor"
                d="M10 2c0-.88 1.056-1.331 1.692-.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08.174l.012.003c.625.133 1.203-.43 2.303-2.173l.14-.224a1 1 0 0 1 1.582-.153C18.733 9.46 20 12.402 20 14.295C20 18.56 16.409 22 12 22s-8-3.44-8-7.706c0-2.252 1.022-4.716 2.632-6.301l.605-.589c.241-.236.434-.43.618-.624C9.285 5.268 10 3.856 10 2" />
            </svg>
            Longest Streak
          </div>
          <div>
            <span class="text-2xl font-semibold tracking-wider">${Math.max(
              statistics['Longest streak'],
              statistics['Current streak']
            )}<span
                class="text-zinc-600 text-xl ml-1">days</span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t-2 mt-4 border-zinc-800 flex items-center justify-between p-2 text-sm">
      <p class="flex text-zinc-500">[Computer Generated Report]</span>
      </p>
      <p class="flex text-zinc-500">Last updated: <span class="font-medium text-zinc-100 pl-1">${moment().format(
        'YYYY-MM-DD HH:mm:ss'
      )}</span>
      </p>
    </div>
  </body>
  
  </html>
    `

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

  const buffer = await page.screenshot({ type: 'png' })

  await browser.close()

  return buffer
}
