import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function Note({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`notes quote bg-bg-200/50 before:bg-custom-500 dark:bg-bg-800/50 relative mt-6 w-full rounded-md p-4 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-[4px] before:rounded-l-full ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-custom-500 h-6 w-6" icon="tabler:info-circle" />
        <h4 className="text-xl font-semibold">Note</h4>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default Note
