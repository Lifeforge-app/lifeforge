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
      tabIndex={-1}
      disabled={actionButtonLoading}
      onClick={onActionButtonClick}
      className="mr-4 shrink-0 rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-300 hover:text-bg-800 focus:outline-none dark:hover:bg-bg-700/70 dark:hover:text-bg-200"
    >
      <Icon icon={actionButtonIcon} className="size-6" />
    </button>
  )
}

export default InputActionButton
