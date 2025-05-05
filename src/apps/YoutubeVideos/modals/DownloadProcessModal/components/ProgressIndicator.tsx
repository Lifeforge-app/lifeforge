import { Icon } from '@iconify/react/dist/iconify.js'

function ProgressIndicator({
  status,
  progress
}: {
  status: 'completed' | 'failed' | 'in_progress' | null
  progress: number
}) {
  switch (status) {
    case 'in_progress':
      return (
        <div className="flex items-center justify-end gap-2">
          <p className="text-bg-500">{progress}%</p>
          <div className="bg-bg-500 h-1 w-48 rounded-md">
            <div
              className="bg-custom-500 h-full rounded-md transition-all"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      )
    case 'completed':
      return (
        <p className="flex items-center gap-2 text-green-500">
          <Icon className="size-5" icon="tabler:check" />
          Downloaded
        </p>
      )
    case 'failed':
      return (
        <p className="flex items-center gap-2 text-red-500">
          <Icon className="size-5" icon="tabler:alert-circle" />
          Failed
        </p>
      )
    default:
      return <></>
  }
}

export default ProgressIndicator
