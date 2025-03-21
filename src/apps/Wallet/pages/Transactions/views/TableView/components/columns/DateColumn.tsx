import dayjs from 'dayjs'

function DateColumn({ date }: { date: string }) {
  return (
    <td className="p-2 text-center whitespace-nowrap">
      {dayjs(date).format('MMM DD, YYYY')}
    </td>
  )
}

export default DateColumn
