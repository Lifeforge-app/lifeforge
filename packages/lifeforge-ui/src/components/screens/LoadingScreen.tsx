export default function LoadingScreen({
  customMessage
}: {
  customMessage?: string
}) {
  return (
    <div className="flex-center size-full flex-col gap-6">
      <span className="loader"></span>
      <p className="text-bg-500 text-lg font-medium">{customMessage ?? ''}</p>
    </div>
  )
}
