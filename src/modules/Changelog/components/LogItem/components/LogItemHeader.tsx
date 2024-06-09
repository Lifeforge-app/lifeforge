import moment from 'moment'
import React from 'react'
import { type IChangeLogVersion } from '@typedec/Changelog'

function LogItemHeader({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <h3 className="mb-2 flex flex-col-reverse items-start justify-end gap-2 text-2xl font-semibold sm:flex-row sm:items-center sm:justify-start">
      <span className="mb-0.5 text-sm text-bg-500 sm:mb-0 sm:w-24 sm:text-right">
        <span className="inline sm:hidden">
          ({moment(entry.date_range[0]).format('MMM D, YYYY')} -{' '}
        </span>
        {moment(entry.date_range[1]).format('MMM D, YYYY')}
        <span className="inline sm:hidden">)</span>
      </span>
      <div
        className={`mx-4 hidden size-4 rounded-full border-2 bg-bg-100 dark:bg-bg-950 sm:block ${
          moment(entry.date_range[1]).isAfter(moment())
            ? 'border-custom-500'
            : 'border-bg-600'
        } outline outline-4 outline-bg-100 dark:outline-bg-950`}
      />
      Ver. {entry.version}
    </h3>
  )
}

export default LogItemHeader
