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

    if (parts.length !== 2) {
      return label
    }

    const startDate = dayjs(parts[0])

    const endDate = dayjs(parts[1])

    if (!startDate.isValid() || !endDate.isValid()) {
      return label
    }

    const start = startDate.format('MMM D')

    const end = endDate.format('MMM D')

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
