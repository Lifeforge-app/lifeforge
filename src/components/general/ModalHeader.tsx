import { Icon } from '@iconify/react'
import React from 'react'

function ModalHeader({
  title,
  icon,
  onClose
}: {
  title: string
  icon: string
  onClose: () => void
}): React.ReactElement {
  return (
    <div className="mb-8 flex items-center justify-between ">
      <h1 className="flex items-center gap-3 text-2xl font-semibold">
        <Icon icon={icon} className="h-7 w-7" />
        {title}
      </h1>
      <button
        onClick={onClose}
        className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
      >
        <Icon icon="tabler:x" className="h-6 w-6" />
      </button>
    </div>
  )
}

export default ModalHeader
