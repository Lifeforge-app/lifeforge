import dayjs from 'dayjs'
import {
  type ByWeekday,
  RRule,
  type Options as RRuleOptions,
  datetime
} from 'rrule'

import type { FreqSpecificParams, RRuleParams } from '..'

const createStartDate = (start: Date | null) => {
  const startDate = dayjs(start)

  return datetime(
    startDate.year(),
    startDate.month() + 1,
    startDate.date(),
    startDate.hour(),
    startDate.minute(),
    startDate.second()
  )
}

const getWeekdayOptions = (day: string): ByWeekday[] => {
  switch (day) {
    case 'day':
      return [
        RRule.MO,
        RRule.TU,
        RRule.WE,
        RRule.TH,
        RRule.FR,
        RRule.SA,
        RRule.SU
      ]
    case 'weekday':
      return [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
    case 'weekendDay':
      return [RRule.SA, RRule.SU]
    default:
      return [
        RRule[day.toUpperCase().slice(0, 2) as keyof typeof RRule] as ByWeekday
      ]
  }
}

const configureYearlyOptions = (
  options: Partial<RRuleOptions>,
  data: FreqSpecificParams['yearly']
) => {
  options.freq = RRule.YEARLY

  if (data.type === 'exactDate') {
    options.bymonth = data.month
    options.bymonthday = data.date
  } else if (data.type === 'relativeDay') {
    options.bysetpos = { first: 1, second: 2, third: 3, fourth: 4, last: -1 }[
      data.onThe
    ]
    options.byweekday = getWeekdayOptions(data.onTheDay)
    options.bymonth = data.onTheDayOfMonth
  }
}

const configureMonthlyOptions = (
  options: Partial<RRuleOptions>,
  data: FreqSpecificParams['monthly']
) => {
  options.freq = RRule.MONTHLY
  options.interval = data.every

  if (data.type === 'exactDate') {
    options.bymonthday = data.onDate
  } else if (data.type === 'relativeDay') {
    options.bysetpos = { first: 1, second: 2, third: 3, fourth: 4, last: -1 }[
      data.onThe
    ]
    options.byweekday = getWeekdayOptions(data.onTheDay)
  }
}

const configureWeeklyOptions = (
  options: Partial<RRuleOptions>,
  data: FreqSpecificParams['weekly']
) => {
  options.freq = RRule.WEEKLY
  options.interval = data.every
  options.byweekday = data.onDays.map(
    (day: string) =>
      RRule[day.toUpperCase().slice(0, 2) as keyof typeof RRule] as ByWeekday
  )
}

const configureDailyOptions = (
  options: Partial<RRuleOptions>,
  data: FreqSpecificParams['daily']
) => {
  options.freq = RRule.DAILY
  options.interval = data.every
}

const configureHourlyOptions = (
  options: Partial<RRuleOptions>,
  data: FreqSpecificParams['hourly']
) => {
  options.freq = RRule.HOURLY
  options.interval = data.every
}

const configureEndOptions = (
  options: Partial<RRuleOptions>,
  data: RRuleParams['end']
) => {
  if (data.type === 'after') {
    options.count = data.after
  } else if (data.type === 'on') {
    options.until = dayjs(data.on).isValid()
      ? dayjs(data.on).toDate()
      : undefined
  }
}

export default function getRRULEString({
  start,
  params
}: {
  start: Date | null
  params: RRuleParams
}) {
  if (!start) return ''

  const options: Partial<RRuleOptions> = {
    dtstart: createStartDate(start),
    tzid: 'Asia/Kuala_Lumpur'
  }

  if (
    Object.values(params.data).some(
      value =>
        ['', undefined, null, 0].includes(value) ||
        (Array.isArray(value) && value.length === 0)
    )
  ) {
    return ''
  }

  switch (params.freq) {
    case 'yearly':
      configureYearlyOptions(
        options,
        params.data as FreqSpecificParams['yearly']
      )
      break
    case 'monthly':
      configureMonthlyOptions(
        options,
        params.data as FreqSpecificParams['monthly']
      )
      break
    case 'weekly':
      configureWeeklyOptions(
        options,
        params.data as FreqSpecificParams['weekly']
      )
      break
    case 'daily':
      configureDailyOptions(options, params.data as FreqSpecificParams['daily'])
      break
    case 'hourly':
      configureHourlyOptions(
        options,
        params.data as FreqSpecificParams['hourly']
      )
      break
  }

  configureEndOptions(options, params.end)

  return new RRule(options).toString()
}
