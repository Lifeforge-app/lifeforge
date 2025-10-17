import { Icon } from '@iconify/react'
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
      className={`notes quote relative mt-6 w-full rounded-md p-2 pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-[4px] before:rounded-full before:bg-blue-500 ${className}`}
    >
      <div className="flex items-center gap-2 text-blue-500">
        <Icon className="h-6 w-6" icon="tabler:info-circle" />
        <h4 className="text-lg font-medium">Note</h4>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default Note
