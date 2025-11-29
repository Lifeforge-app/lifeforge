import { Icon } from '@iconify/react'

interface LoadingScreenProps {
  /** An optional message to display below the loading indicator. */
  message?: string
}

/**
 * A reusable loading screen component for displaying a loading indicator.
 */
export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex-center size-full flex-1 flex-col gap-6">
      <Icon className="text-bg-500 size-10" icon="svg-spinners:ring-resize" />
      <p className="text-bg-500 text-lg font-medium">{message ?? ''}</p>
    </div>
  )
}
