import dayjs from 'dayjs'

function DateColumn({ date }: { date: string }) {
  return (
    <td className="whitespace-nowrap p-2 text-center">
      {dayjs(date).format('MMM DD, YYYY')}
    </td>
  )
}

export default DateColumn
