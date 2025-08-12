import dayjs from 'dayjs'
import {
  type ByWeekday,
  Frequency,
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
    dtstart: createStartDate(start)
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

export function fromRRULEString(rrule: string): {
  rrule: RRuleParams
  start: Date | null
  duration: {
    duration_amt: number
    duration_unit: 'hour' | 'day' | 'week' | 'month' | 'year'
  } | null
} | null {
  const duration = rrule.split('||')[1]

  let durationParams: {
    duration_amt: number
    duration_unit: 'hour' | 'day' | 'week' | 'month' | 'year'
  } | null = null

  if (duration) {
    durationParams = Object.fromEntries(
      duration.split(';').map(part => part.split('='))
    )
  }

  const options = RRule.parseString(rrule.split('||')[0])

  if (!options) return null

  const freq = options.freq

  const getWeekdayString = (weekday: ByWeekday): string => {
    if (typeof weekday === 'object' && 'weekday' in weekday) {
      const weekdayMap: Record<number, string> = {
        0: 'mon',
        1: 'tue',
        2: 'wed',
        3: 'thu',
        4: 'fri',
        5: 'sat',
        6: 'sun'
      }

      return weekdayMap[weekday.weekday] || 'mon'
    }

    if (typeof weekday === 'string') {
      const stringMap: Record<string, string> = {
        MO: 'mon',
        TU: 'tue',
        WE: 'wed',
        TH: 'thu',
        FR: 'fri',
        SA: 'sat',
        SU: 'sun'
      }

      return stringMap[weekday] || 'mon'
    }

    if (typeof weekday === 'number') {
      const weekdayMap: Record<number, string> = {
        0: 'mon',
        1: 'tue',
        2: 'wed',
        3: 'thu',
        4: 'fri',
        5: 'sat',
        6: 'sun'
      }

      return weekdayMap[weekday] || 'mon'
    }

    return 'mon'
  }

  const getSetPosString = (setpos: number): string => {
    const setposMap: Record<number, string> = {
      1: 'first',
      2: 'second',
      3: 'third',
      4: 'fourth',
      [-1]: 'last'
    }

    return setposMap[setpos] || 'first'
  }

  const getEndConfig = () => {
    if (options.count) {
      return {
        type: 'after' as const,
        after: options.count,
        on: null
      }
    } else if (options.until) {
      return {
        type: 'on' as const,
        after: 1,
        on: options.until
      }
    } else {
      return {
        type: 'never' as const,
        after: 1,
        on: null
      }
    }
  }

  let data: FreqSpecificParams[keyof FreqSpecificParams]
  let freqKey: keyof FreqSpecificParams

  switch (freq) {
    case Frequency.YEARLY: {
      freqKey = 'yearly'

      if (options.bymonth && options.bymonthday) {
        data = {
          type: 'exactDate',
          month: Array.isArray(options.bymonth)
            ? options.bymonth[0]
            : options.bymonth,
          date: Array.isArray(options.bymonthday)
            ? options.bymonthday[0]
            : options.bymonthday,
          onThe: 'first',
          onTheDay: 'mon',
          onTheDayOfMonth: 1
        } satisfies FreqSpecificParams['yearly']
      } else if (options.bysetpos && options.byweekday && options.bymonth) {
        const setpos = Array.isArray(options.bysetpos)
          ? options.bysetpos[0]
          : options.bysetpos

        const weekday = Array.isArray(options.byweekday)
          ? options.byweekday[0]
          : options.byweekday

        const month = Array.isArray(options.bymonth)
          ? options.bymonth[0]
          : options.bymonth

        data = {
          type: 'relativeDay',
          month: 1,
          date: 1,
          onThe: getSetPosString(setpos),
          onTheDay: getWeekdayString(weekday),
          onTheDayOfMonth: month
        } satisfies FreqSpecificParams['yearly']
      } else {
        data = {
          type: 'exactDate',
          month: 1,
          date: 1,
          onThe: 'first',
          onTheDay: 'mon',
          onTheDayOfMonth: 1
        } satisfies FreqSpecificParams['yearly']
      }
      break
    }

    case Frequency.MONTHLY: {
      freqKey = 'monthly'

      const interval = options.interval || 1

      if (options.bymonthday) {
        const date = Array.isArray(options.bymonthday)
          ? options.bymonthday[0]
          : options.bymonthday

        data = {
          type: 'exactDate',
          every: interval,
          onDate: date,
          onThe: 'first',
          onTheDay: 'mon'
        } satisfies FreqSpecificParams['monthly']
      } else if (options.bysetpos && options.byweekday) {
        const setpos = Array.isArray(options.bysetpos)
          ? options.bysetpos[0]
          : options.bysetpos

        const weekday = Array.isArray(options.byweekday)
          ? options.byweekday[0]
          : options.byweekday

        data = {
          type: 'relativeDay',
          every: interval,
          onDate: 1,
          onThe: getSetPosString(setpos),
          onTheDay: getWeekdayString(weekday)
        } satisfies FreqSpecificParams['monthly']
      } else {
        data = {
          type: 'exactDate',
          every: interval,
          onDate: 1,
          onThe: 'first',
          onTheDay: 'mon'
        } satisfies FreqSpecificParams['monthly']
      }
      break
    }

    case Frequency.WEEKLY: {
      freqKey = 'weekly'

      const interval = options.interval || 1

      const weekdays = options.byweekday || [RRule.MO]

      const onDays = (Array.isArray(weekdays) ? weekdays : [weekdays]).map(
        getWeekdayString
      ) as ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[]

      data = {
        every: interval,
        onDays
      } satisfies FreqSpecificParams['weekly']
      break
    }

    case Frequency.DAILY: {
      freqKey = 'daily'

      const interval = options.interval || 1

      data = {
        every: interval
      } satisfies FreqSpecificParams['daily']
      break
    }

    case Frequency.HOURLY: {
      freqKey = 'hourly'

      const interval = options.interval || 1

      data = {
        every: interval
      } satisfies FreqSpecificParams['hourly']
      break
    }
    default:
      return null
  }

  return {
    start: options.dtstart ? dayjs(options.dtstart).toDate() : null,
    rrule: {
      freq: freqKey,
      data,
      end: getEndConfig()
    } as RRuleParams,
    duration: durationParams
  }
}
