import moment from 'moment'
import React from 'react'

function DateColumn({ date }: { date: string }): React.ReactElement {
  return (
    <td className="whitespace-nowrap p-2 text-center">
      {moment(date).format('MMM DD, YYYY')}
    </td>
  )
}

export default DateColumn
