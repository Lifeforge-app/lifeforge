import clsx from 'clsx'
import moment from 'moment'
import React from 'react'

import { type IChangeLogVersion } from '../../../interfaces/changelog_interfaces'

function LogItemHeader({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <h3 className="mb-2 flex flex-col-reverse items-start justify-end gap-2 text-2xl font-semibold sm:flex-row sm:items-center sm:justify-start">
      <span className="text-bg-500 mb-0.5 text-sm sm:mb-0 sm:w-24 sm:text-right">
        <span className="inline sm:hidden">
          ({moment(entry.date_range[0]).format('MMM D, YYYY')} -{' '}
        </span>
        {moment(entry.date_range[1]).format('MMM D, YYYY')}
        <span className="inline sm:hidden">)</span>
      </span>
      <div
        className={clsx(
          'bg-bg-100 dark:bg-bg-950 outline-bg-100 dark:outline-bg-950 mx-4 hidden size-4 rounded-full outline outline-4 sm:block',
          moment(entry.date_range[1]).isAfter(moment())
            ? 'border-custom-500 border-4'
            : 'border-bg-600 border-2'
        )}
      />
      Ver. {entry.version}
    </h3>
  )
}

export default LogItemHeader
