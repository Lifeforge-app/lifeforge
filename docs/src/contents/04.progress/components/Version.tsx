import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import React from 'react'

dayjs.extend(weekOfYear)

function Version({
  prefix = 'dev',
  year = dayjs().year(),
  week,
  children
}: {
  prefix?: string
  year?: number
  week: number
  children: React.ReactNode
}) {
  const version = `${prefix} ${dayjs().year(year).format('YY')}w${week}`

  const startOfWeek = dayjs()
    .year(year)
    .week(week)
    .startOf('week')
    .format('DD MMM YYYY')

  const endOfWeek = dayjs()
    .year(year)
    .week(week)
    .endOf('week')
    .format('DD MMM YYYY')

  return (
    <section id={`${prefix}-${dayjs().year(year).format('YY')}-w-${week}`}>
      <header className="space-y-2">
        <div className="flex items-center gap-3 text-2xl font-semibold sm:text-3xl">
          <div className="bg-custom-500/20 text-custom-500 rounded-lg p-3">
            <Icon className="size-10" icon="tabler:history" />
          </div>
          <div>
            <h2 className="block">{version}</h2>
            <span className="text-bg-500 block text-base">
              {startOfWeek} - {endOfWeek}
            </span>
          </div>
        </div>
      </header>
      {children}
      <hr className="border-bg-200 dark:border-bg-800 mt-8 mb-4 border-t-[1.5px] sm:mt-12 sm:mb-8" />
    </section>
  )
}

export default Version
