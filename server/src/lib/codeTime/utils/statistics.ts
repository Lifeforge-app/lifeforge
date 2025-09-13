import { PBService } from '@functions/database'
import moment from 'moment'

import { getDates } from './dates'

export default async (pb: PBService) => {
  const everything = await pb.getFullList
    .collection('code_time__daily_entries')
    .sort(['date'])
    .execute()

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
    'Current streak': currentStreak,
    'Time spent today': dateMap[moment().format('YYYY-MM-DD')] || 0
  }
}
