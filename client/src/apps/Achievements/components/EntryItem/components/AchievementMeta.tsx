function AchievementMeta({
  title,
  thoughts
}: {
  title: string
  thoughts: string
}) {
  return (
    <div className="-mt-1">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-bg-500 mt-1 text-sm whitespace-pre-wrap">{thoughts}</p>
    </div>
  )
}

export default AchievementMeta
