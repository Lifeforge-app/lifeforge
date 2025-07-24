import dayjs from 'dayjs'
import { ByWeekday, RRule, Options as RRuleOptions, datetime } from 'rrule'

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
  {
    yearlyType,
    yearlyMonth,
    yearlyDate,
    yearlyOnThe,
    yearlyOnTheDay,
    yearlyOnTheDayOfMonth
  }: {
    yearlyType: string
    yearlyMonth: number
    yearlyDate: string
    yearlyOnThe: string
    yearlyOnTheDay: string
    yearlyOnTheDayOfMonth: number
  }
) => {
  options.freq = RRule.YEARLY

  if (yearlyType === 'exactDate') {
    options.bymonth = yearlyMonth + 1
    options.bymonthday = parseInt(yearlyDate, 10)
  } else if (yearlyType === 'relativeDay') {
    options.bysetpos = { first: 1, second: 2, third: 3, fourth: 4, last: -1 }[
      yearlyOnThe
    ]
    options.byweekday = getWeekdayOptions(yearlyOnTheDay)
    options.bymonth = yearlyOnTheDayOfMonth + 1
  }
}

const configureMonthlyOptions = (
  options: Partial<RRuleOptions>,
  {
    monthlyEvery,
    monthlyType,
    monthlyOnDate,
    monthlyOnThe,
    monthlyOnTheDay
  }: {
    monthlyEvery: string
    monthlyType: string
    monthlyOnDate: string
    monthlyOnThe: string
    monthlyOnTheDay: string
  }
) => {
  options.freq = RRule.MONTHLY
  options.interval = parseInt(monthlyEvery, 10)

  if (monthlyType === 'exactDate') {
    options.bymonthday = parseInt(monthlyOnDate, 10)
  } else if (monthlyType === 'relativeDay') {
    options.bysetpos = { first: 1, second: 2, third: 3, fourth: 4, last: -1 }[
      monthlyOnThe
    ]
    options.byweekday = getWeekdayOptions(monthlyOnTheDay)
  }
}

const configureWeeklyOptions = (
  options: Partial<RRuleOptions>,
  { weeklyEvery, weeklyOn }: any
) => {
  options.freq = RRule.WEEKLY
  options.interval = parseInt(weeklyEvery, 10)
  options.byweekday = weeklyOn.map(
    (day: string) =>
      RRule[day.toUpperCase().slice(0, 2) as keyof typeof RRule] as ByWeekday
  )
}

const configureDailyOptions = (
  options: Partial<RRuleOptions>,
  { dailyEvery }: any
) => {
  options.freq = RRule.DAILY
  options.interval = parseInt(dailyEvery, 10)
}

const configureHourlyOptions = (
  options: Partial<RRuleOptions>,
  { hourlyEvery }: any
) => {
  options.freq = RRule.HOURLY
  options.interval = parseInt(hourlyEvery, 10)
}

const configureEndOptions = (
  options: Partial<RRuleOptions>,
  { endType, endAfter, endOn }: any
) => {
  if (endType === 'after') {
    options.count = parseInt(endAfter, 10)
  } else if (endType === 'on') {
    options.until = dayjs(endOn).isValid() ? dayjs(endOn).toDate() : undefined
  }
}

export default function getRRULEString(query: {
  start: Date | null
  freq: string
  yearlyType: string
  yearlyMonth: number
  yearlyDate: string
  yearlyOnThe: string
  yearlyOnTheDay: string
  yearlyOnTheDayOfMonth: number
  monthlyEvery: string
  monthlyType: string
  monthlyOnDate: string
  monthlyOnThe: string
  monthlyOnTheDay: string
  weeklyEvery: string
  weeklyOn: string[]
  dailyEvery: string
  hourlyEvery: string
  endType: 'never' | 'after' | 'on'
  endAfter: string
  endOn: Date | null
}) {
  const options: Partial<RRuleOptions> = {
    dtstart: createStartDate(params.start),
    tzid: 'Asia/Kuala_Lumpur'
  }

  switch (params.freq) {
    case 'yearly':
      configureYearlyOptions(options, params)
      break
    case 'monthly':
      configureMonthlyOptions(options, params)
      break
    case 'weekly':
      configureWeeklyOptions(options, params)
      break
    case 'daily':
      configureDailyOptions(options, params)
      break
    case 'hourly':
      configureHourlyOptions(options, params)
      break
  }

  configureEndOptions(options, params)

  return new RRule(options).toString()
}
