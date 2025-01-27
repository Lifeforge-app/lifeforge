import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'

function StatementHeader({
  month,
  year
}: {
  month: number
  year: number
}): React.ReactElement {
  return (
    <>
      <h1 className="mb-8 hidden items-center gap-2 text-4xl font-medium print:flex">
        <Icon
          icon="tabler:hammer"
          className="size-12 text-custom-500 print:text-lime-600"
        />
        Lifeforge
        <span className="text-custom-500 print:text-lime-600">.</span>
      </h1>
      <h1 className="hidden text-6xl font-bold uppercase leading-snug tracking-widest print:block">
        Personal
        <br />
        Financial Statements
      </h1>
      <p className="mt-4 hidden text-3xl text-bg-500 print:block">
        For the month ended{' '}
        <span className="font-bold text-bg-100">
          {moment()
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
