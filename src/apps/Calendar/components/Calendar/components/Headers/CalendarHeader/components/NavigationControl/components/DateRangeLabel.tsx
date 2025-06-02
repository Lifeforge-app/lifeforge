import dayjs from 'dayjs'

function DateRangeLabel({ label }: { label: string }) {
  if (label.match(/^(\w+)\s(\w+)$/)) {
    return (
      <>
        <span>{label.split(' ')[0]}</span>
        <span className="text-bg-500">{label.split(' ')[1]}</span>
      </>
    )
  }

  if (label.match(/^\d/)) {
    const parts = label.split(' – ')
    console.log(parts)
    const start = dayjs(parts[0]).format('MMM D')
    const end = dayjs(parts[1]).format('MMM D')

    return (
      <>
        <span>{start}</span>
        <span className="text-bg-500"> - {end}</span>
      </>
    )
  }

  return label
}

export default DateRangeLabel
