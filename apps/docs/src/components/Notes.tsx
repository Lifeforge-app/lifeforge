import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function Notes({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`quote bg-bg-200/50 dark:bg-bg-800/70 border-custom-500 mt-6 w-full rounded-md border-l-4 p-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-custom-500 h-6 w-6" icon="tabler:info-circle" />
        <h3 className="text-xl font-semibold">Notes</h3>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default Notes
