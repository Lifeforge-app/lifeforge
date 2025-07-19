import dayjs from 'dayjs'

export default function getDayClassName({
  index,
  firstDay,
  lastDate,
  startDate,
  endDate,
  isFirstAndLastDay,
  isBetweenFirstAndLastDay
}: {
  index: number
  firstDay: number
  lastDate: number
  startDate: string | undefined
  endDate: string | undefined
  isFirstAndLastDay: string
  isBetweenFirstAndLastDay: boolean
}) {
  if (firstDay > index || index - firstDay + 1 > lastDate) {
    return 'pointer-events-none text-bg-300 dark:text-bg-600'
  }

  if (
    firstDay <= index &&
    index - firstDay + 1 <= lastDate &&
    (startDate !== null || endDate !== null)
  ) {
    if (isFirstAndLastDay !== '') {
      const isSingleDate = dayjs(startDate).isSame(
        dayjs(endDate ?? dayjs().format('YYYY-M-D')),
        'day'
      )

      const borderClassName =
        isFirstAndLastDay === 'first'
          ? 'after:rounded-l-sm after:border-y after:border-l'
          : 'after:rounded-r-sm after:border-y after:border-r'

      return `font-semibold after:absolute after:left-1/2 after:top-1/2 after:z-[-1] after:h-12 after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:border-custom-500 after:content-[''] ${
        isSingleDate ? 'after:rounded-sm after:border' : borderClassName
      }`
    }

    if (isBetweenFirstAndLastDay) {
      return "after:absolute after:left-1/2 after:top-1/2 after:z-[-2] after:h-12 after:w-full after:-translate-x-1/2 after:-translate-y-1/2 after:border-y after:border-custom-500 after:content-['']"
    }
  }

  return 'cursor-pointer'
}
