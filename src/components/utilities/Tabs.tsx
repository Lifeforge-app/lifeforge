import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

function Tabs<T extends string>({
  items,
  enabled,
  active,
  onNavClick,
  className
}: {
  items: Array<{
    id: T
    name: string
    icon: string
    amount?: number
  }>
  enabled: T[]
  active: T
  onNavClick: (id: T) => void
  className?: string
}): React.ReactElement {
  return (
    <div className="mb-6 flex items-center">
      {items
        .filter(({ id }) => enabled.includes(id))
        .map(({ name, icon, id }) => (
          <button
            key={id}
            className={clsx(
              'flex w-full min-w-0 cursor-pointer items-center justify-center gap-2 border-b-2 p-4 uppercase tracking-widest transition-all',
              active === id
                ? 'border-custom-500 font-medium text-custom-500'
                : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200',
              className
            )}
            onClick={() => {
              onNavClick(id)
            }}
          >
            <Icon className="size-5 shrink-0" icon={icon} />
            <span className="truncate sm:block">{name}</span>
            {items.find(item => item.name === name)?.amount !== undefined && (
              <span className="hidden text-sm sm:block">
                ({items.find(item => item.name === name)?.amount})
              </span>
            )}
          </button>
        ))}
    </div>
  )
}

export default Tabs
