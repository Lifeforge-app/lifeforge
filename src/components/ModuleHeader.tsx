import { Icon } from '@iconify/react'
import React from 'react'

interface ModuleHeaderProps {
  title: string | React.ReactNode
  desc?: string | React.ReactNode
}

function ModuleHeader({ title, desc }: ModuleHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-neutral-800 dark:text-neutral-100 md:text-4xl">
            {title}
          </h1>
          {desc !== undefined && <div className="text-neutral-500">{desc}</div>}
        </div>
      </div>
      <button className="rounded-lg p-4 text-neutral-500 transition-all hover:bg-neutral-200/50 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-100">
        <Icon icon="tabler:dots-vertical" className="text-2xl" />
      </button>
    </div>
  )
}

export default ModuleHeader
