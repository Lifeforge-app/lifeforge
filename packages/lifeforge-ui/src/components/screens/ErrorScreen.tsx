import { Icon } from '@iconify/react'

import { Button } from '@components/controls'

interface ErrorScreenProps {
  /** The error message to display. Can be a string or a React node for more complex formatting. */
  message: string | React.ReactNode
  /** Whether to show a retry button that reloads the page */
  showRetryButton?: boolean
}

/**
 * A reusable error screen component for displaying error messages.
 */
function ErrorScreen({ message, showRetryButton }: ErrorScreenProps) {
  return (
    <div className="flex-center size-full flex-col gap-6">
      <Icon className="size-16 text-red-500" icon="tabler:alert-triangle" />
      <p className="text-center text-lg font-medium text-red-500">{message}</p>
      {showRetryButton && (
        <Button
          icon="tabler:refresh"
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      )}
    </div>
  )
}

export default ErrorScreen
