import { Icon } from '@iconify/react'
import React from 'react'

function InputActionButton({
  actionButtonLoading,
  onActionButtonClick,
  actionButtonIcon
}: {
  actionButtonLoading: boolean
  onActionButtonClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  actionButtonIcon: string
}): React.ReactElement {
  return (
    <button
      className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-300 hover:text-bg-800 focus:outline-hidden dark:hover:bg-bg-700/70 dark:hover:text-bg-200"
      disabled={actionButtonLoading}
      tabIndex={-1}
      onClick={onActionButtonClick}
    >
      <Icon
        className="size-6"
        icon={actionButtonLoading ? 'svg-spinners:180-ring' : actionButtonIcon}
      />
    </button>
  )
}

export default InputActionButton
