import { Icon } from '@iconify/react'
import clsx from 'clsx'

interface LoadingScreenProps {
  /** An optional message to display below the loading indicator. */
  message?: string
  /** An optional size for the loading indicator. Default to 2.5rem. */
  loaderSize?: string
  /** Additional CSS class names to apply to the loading screen container. */
  className?: string
}

/**
 * A reusable loading screen component for displaying a loading indicator.
 */
export default function LoadingScreen({
  message,
  className,
  loaderSize
}: LoadingScreenProps) {
  return (
    <div
      className={clsx(
        'flex-center size-full flex-1 flex-col gap-[1.5rem]',
        className
      )}
    >
      <Icon
        className="text-bg-500"
        icon="svg-spinners:ring-resize"
        style={{ fontSize: loaderSize || '2.5rem' }}
      />
      {message && <p className="text-bg-500 text-lg font-medium">{message}</p>}
    </div>
  )
}
