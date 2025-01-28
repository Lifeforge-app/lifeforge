import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function SidebarCancelButton({
  onClick
}: {
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
      className="z-9999 overscroll-contain rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-50"
    >
      <Icon icon="tabler:x" className="size-5" />
    </button>
  )
}

export default SidebarCancelButton
