import { Icon } from '@iconify/react/dist/iconify.js'
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
      className={`quote bg-bg-200/50 dark:bg-bg-800/70 mt-6 w-full rounded-md border-l-4 border-amber-500 p-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-6 w-6 text-amber-500" icon="tabler:alert-triangle" />
        <h3 className="text-xl font-semibold">Warning</h3>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default Warning
