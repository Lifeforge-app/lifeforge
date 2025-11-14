import { Icon } from '@iconify/react'

export default function LoadingScreen({
  customMessage
}: {
  customMessage?: string
}) {
  return (
    <div className="flex-center size-full flex-1 flex-col gap-6">
      <Icon className="text-bg-500 size-10" icon="svg-spinners:ring-resize" />
      <p className="text-bg-500 text-lg font-medium">{customMessage ?? ''}</p>
    </div>
  )
}
