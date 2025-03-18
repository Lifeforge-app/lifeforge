import moment from 'moment'

function DateColumn({ date }: { date: string }) {
  return (
    <td className="whitespace-nowrap p-2 text-center">
      {moment(date).format('MMM DD, YYYY')}
    </td>
  )
}

export default DateColumn
