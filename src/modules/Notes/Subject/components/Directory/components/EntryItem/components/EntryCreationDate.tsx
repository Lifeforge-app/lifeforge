import moment from 'moment'
import React from 'react'
import { Tooltip } from 'react-tooltip'

function EntryCreationDate({
  id,
  date
}: {
  id: string
  date: string
}): React.ReactElement {
  return (
    <div className="z-50 hidden w-1/5 shrink-0 items-center md:flex">
      <div
        data-tooltip-id={`date-tooltip-${id}`}
        data-tooltip-content={moment(date).format('MMMM Do YYYY, h:mm:ss a')}
        className="z-50 shrink-0 text-bg-500 dark:text-bg-400"
      >
        {moment(date).fromNow()}
      </div>
      <Tooltip id={`date-tooltip-${id}`} className="z-50" />
    </div>
  )
}

export default EntryCreationDate
