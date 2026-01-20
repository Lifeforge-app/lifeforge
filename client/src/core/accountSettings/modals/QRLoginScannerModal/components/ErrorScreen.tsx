import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'

function ErrorScreen({
  onClose,
  errorMessage
}: {
  onClose: () => void
  errorMessage: string
}) {
  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      <div className="flex-center size-20 rounded-lg bg-red-500/20">
        <Icon className="size-10 text-red-500" icon="tabler:alert-triangle" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-medium">{errorMessage}</h3>
      </div>
      <Button
        className="mt-4 w-full"
        icon="tabler:x"
        variant="secondary"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  )
}

export default ErrorScreen
