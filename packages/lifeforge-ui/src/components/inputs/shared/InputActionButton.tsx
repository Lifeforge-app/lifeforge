import { Icon } from '@iconify/react'

function InputActionButton({
  actionButtonLoading,
  onActionButtonClick,
  actionButtonIcon
}: {
  actionButtonLoading: boolean
  onActionButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  actionButtonIcon: string
}) {
  return (
    <button
      className="text-bg-500 hover:bg-bg-300 hover:text-bg-800 focus:outline-hidden dark:hover:bg-bg-700/70 dark:hover:text-bg-200 mr-4 shrink-0 rounded-lg p-2 transition-all"
      disabled={actionButtonLoading}
      tabIndex={-1}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
        onActionButtonClick(e)
      }}
    >
      <Icon
        className="size-6"
        icon={actionButtonLoading ? 'svg-spinners:180-ring' : actionButtonIcon}
      />
    </button>
  )
}

export default InputActionButton
