function DateRangeLabel({ label }: { label: string }) {
  return label.match(/^(\w+)\s(\w+)$/) ? (
    <>
      <span>{label.split(' ')[0]}</span>
      <span className="text-bg-500">{label.split(' ')[1]}</span>
    </>
  ) : (
    label
  )
}

export default DateRangeLabel
