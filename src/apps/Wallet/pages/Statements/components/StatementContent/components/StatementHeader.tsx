import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

function StatementHeader({ month, year }: { month: number; year: number }) {
  return (
    <>
      <h1 className="mb-8 hidden items-center gap-2 text-4xl font-medium print:flex">
        <Icon
          className="text-custom-500 size-12 print:text-lime-600"
          icon="tabler:hammer"
        />
        Lifeforge
        <span className="text-custom-500 print:text-lime-600">.</span>
      </h1>
      <h1 className="hidden text-6xl font-bold uppercase leading-snug tracking-widest print:block">
        Personal
        <br />
        Financial Statements
      </h1>
      <p className="text-bg-500 mt-4 hidden text-3xl print:block">
        For the month ended{' '}
        <span className="text-bg-100 font-bold">
          {dayjs()
            .year(year)
            .month(month + 1)
            .date(0)
            .format('DD MMMM YYYY')}
        </span>
      </p>
    </>
  )
}

export default StatementHeader
