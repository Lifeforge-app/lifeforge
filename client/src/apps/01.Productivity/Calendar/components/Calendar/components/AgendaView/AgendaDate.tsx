function AgendaDate({ label }: { label: string }) {
  return (
    <div className="p-2">
      <div className="text-lg font-semibold">
        {label.split(' ').slice(1).join(' ')}
      </div>
      <div className="text-bg-500 text-sm font-semibold">
        {label.split(' ')[0]}
      </div>
    </div>
  )
}

export default AgendaDate
