import { Icon } from '@iconify/react'
import clsx from 'clsx'

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
    color?: string
    icon?: string
    amount?: number
  }>
  enabled: T[]
  active: T
  onNavClick: (id: T) => void
  className?: string
}) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-y-2', className)}>
      {items
        .filter(({ id }) => enabled.includes(id))
        .map(({ name, icon, id, color }) => (
          <button
            key={id}
            className={clsx(
              'flex flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 p-4 tracking-widest uppercase transition-all',
              active === id
                ? `${
                    !color ? 'border-custom-500 text-custom-500' : ''
                  } font-medium`
                : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
            )}
            style={
              color && active === id
                ? {
                    borderColor: color,
                    color: color
                  }
                : {}
            }
            onClick={() => {
              onNavClick(id)
            }}
          >
            {icon && <Icon className="size-5 shrink-0" icon={icon} />}
            <span className="block">{name}</span>
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
