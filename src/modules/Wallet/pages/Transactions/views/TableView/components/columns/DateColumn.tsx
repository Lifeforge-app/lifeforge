import moment from 'moment'
import React from 'react'

function DateColumn({ date }: { date: string }): React.ReactElement {
  return (
    <td className="p-2 text-center whitespace-nowrap">
      {moment(date).format('MMM DD, YYYY')}
    </td>
  )
}

export default DateColumn
