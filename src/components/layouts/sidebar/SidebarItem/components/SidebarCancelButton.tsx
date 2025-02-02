import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function SidebarCancelButton({
  onClick
}: {
  onClick: () => void
}): React.ReactElement {
  return (
    <button
      className="z-9999 overscroll-contain rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700/50 dark:hover:text-bg-50"
      onClick={e => {
        e.stopPropagation()
        onClick()
      }}
    >
      <Icon className="size-5" icon="tabler:x" />
    </button>
  )
}

export default SidebarCancelButton
