import dayjs from 'dayjs'

export default function getDateRange(
  rangeMode: 'week' | 'month' | 'year' | 'all' | 'custom' | 'quarter',
  startDate?: string,
  endDate?: string
): { startDate: string | null; endDate: string | null } {
  let start: dayjs.Dayjs | null = null
  let end: dayjs.Dayjs | null = null

  const today = dayjs().endOf('day')

  switch (rangeMode) {
    case 'week':
      start = dayjs().subtract(7, 'days').startOf('day')
      end = today
      break
    case 'month':
      start = dayjs().subtract(1, 'month').startOf('day')
      end = today
      break
    case 'quarter':
      start = dayjs().subtract(3, 'months').startOf('day')
      end = today
      break
    case 'year':
      start = dayjs().subtract(1, 'year').startOf('day')
      end = today
      break
    case 'all':
      start = null
      end = null
      break
    case 'custom':
      if (startDate) {
        start = dayjs(startDate).startOf('day')
      }

      if (endDate) {
        end = dayjs(endDate).endOf('day')
      }
      break
  }

  return {
    startDate: start ? start.format('YYYY-MM-DD') : null,
    endDate: end ? end.format('YYYY-MM-DD') : null
  }
}
