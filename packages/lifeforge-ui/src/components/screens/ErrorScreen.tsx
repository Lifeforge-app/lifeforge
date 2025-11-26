import { Button } from '@components/buttons'
import { Icon } from '@iconify/react'

function ErrorScreen({
  message,
  showRetryButton
}: {
  message: string
  showRetryButton?: boolean
}) {
  return (
    <div className="flex-center size-full flex-col gap-6">
      <Icon className="size-12 text-red-500" icon="tabler:alert-triangle" />
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
