import { Icon } from '@iconify/react'
import React from 'react'

function Warning({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`notes quote relative mt-6 w-full rounded-md p-2 pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-[4px] before:rounded-full before:bg-amber-500 ${className}`}
    >
      <div className="flex items-center gap-2 text-amber-500">
        <Icon className="h-6 w-6 text-amber-500" icon="tabler:alert-triangle" />
        <h4 className="text-lg font-medium">Warning</h4>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default Warning
