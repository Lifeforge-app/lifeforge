function WeekHeader({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-bg-500 text-sm font-semibold">
        {label.split(' ').pop()}
      </div>
      <div className="text-xl font-semibold">{label.split(' ')[0]}</div>
    </div>
  )
}

export default WeekHeader
