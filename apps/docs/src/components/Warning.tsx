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
    <div className="relative w-full before:absolute before:top-0 before:left-0 before:h-full before:w-[4px] before:rounded-l-full before:bg-amber-500">
      <div
        className={`notes quote bg-bg-200/50 dark:bg-bg-800/50 mt-6 w-full rounded-md p-4 pl-6 ${className}`}
      >
        <div className="flex items-center gap-2">
          <Icon
            className="h-6 w-6 text-amber-500"
            icon="tabler:alert-triangle"
          />
          <h4 className="text-xl font-semibold">Warning</h4>
        </div>
        <p className="-mt-2 text-base">{children}</p>
      </div>
    </div>
  )
}

export default Warning
