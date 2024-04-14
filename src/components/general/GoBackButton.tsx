import { Icon } from '@iconify/react'
import React from 'react'

function GoBackButton({
  onClick
}: {
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className="-ml-1 mb-2 flex w-min items-center gap-1 rounded-lg pl-0 text-bg-500 hover:text-bg-800 dark:hover:text-bg-100 sm:gap-2"
    >
      <Icon icon="tabler:chevron-left" className="text-lg sm:text-xl" />
      <span className="whitespace-nowrap text-base font-medium sm:text-lg">
        Go back
      </span>
    </button>
  )
}

export default GoBackButton
