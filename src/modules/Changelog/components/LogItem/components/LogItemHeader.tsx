import moment from 'moment'
import React from 'react'
import { type IChangeLogVersion } from '@typedec/Changelog'

function LogItemHeader({
  entry
}: {
  entry: IChangeLogVersion
}): React.ReactElement {
  return (
    <h3 className="mb-2 flex flex-col items-center gap-2 text-2xl font-semibold sm:flex-row">
      <span className="w-24 text-right text-sm text-bg-500">
        {moment(entry.date_range[1]).format('MMM D, YYYY')}
      </span>
      <div
        className={`mx-4 h-4 w-4 rounded-full border-2 bg-bg-950 ${
          moment(entry.date_range[1]).isAfter(moment())
            ? 'border-custom-500'
            : 'border-bg-600'
        } outline outline-4 outline-bg-950`}
      />
      Ver. {entry.version}
    </h3>
  )
}

export default LogItemHeader
