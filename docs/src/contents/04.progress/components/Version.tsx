import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { Card } from 'lifeforge-ui'
import { useState } from 'react'

dayjs.extend(weekOfYear)

function Version({
  prefix = 'dev',
  year = dayjs().year(),
  week,
  liCount,
  isLatest,
  children
}: {
  prefix?: string
  year?: number
  week: number
  liCount?: number
  isLatest: boolean
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(!isLatest)

  const version = `${prefix} ${dayjs().year(year).format('YY')}w${week.toString().padStart(2, '0')}`

  // Start from January 4th of the year (guaranteed to be in week 1 per ISO 8601)
  // then add the weeks offset
  const weekDate = dayjs(`${year}-01-04`).week(week)

  const startOfWeek = weekDate.startOf('week').format('DD MMM YYYY')

  const endOfWeek = weekDate.endOf('week').format('DD MMM YYYY')

  return (
    <div>
      <Card
        className="p-0!"
        id={`${prefix}-${dayjs().year(year).format('YY')}-w-${week.toString().padStart(2, '0')}`}
      >
        <header
          className="hover:bg-bg-100 dark:hover:bg-bg-800/50 flex cursor-pointer items-center justify-between gap-4 p-4 transition-colors select-none"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex items-center gap-4">
            <div className="bg-bg-500/10 text-bg-500 flex-center size-13 rounded-lg">
              <Icon className="size-8 shrink-0" icon="tabler:history" />
            </div>
            <div>
              <h2 className="text-xl font-medium sm:text-2xl">{version}</h2>
              <span className="text-bg-500 text-sm">{liCount} entries</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-bg-500 hidden text-sm sm:block">
              {startOfWeek} - {endOfWeek}
            </span>
            <Icon
              className={`text-bg-500 size-5 shrink-0 transition-transform duration-500 ${
                !collapsed ? 'rotate-180' : ''
              }`}
              icon="tabler:chevron-down"
            />
          </div>
        </header>
        <div
          className="grid px-4 transition-[grid-template-rows] duration-200"
          style={{ gridTemplateRows: collapsed ? '0fr' : '1fr' }}
        >
          <div className="min-h-0" style={{ clipPath: 'inset(0)' }}>
            <div className="pb-8">{children}</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Version
