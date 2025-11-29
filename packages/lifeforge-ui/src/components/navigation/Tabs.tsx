import { Icon } from '@iconify/react'
import clsx from 'clsx'

/**
 * A tab component that displays a list of tabs and allows switching between them.
 */
function Tabs<
  T extends ReadonlyArray<{
    readonly id: string
    readonly name: string
    readonly color?: string
    readonly icon?: string
    readonly amount?: number
  }>,
  TKey = T extends ReadonlyArray<{ readonly id: infer U }> ? U : never
>({
  items,
  enabled,
  currentTab,
  onTabChange,
  className
}: {
  items: T
  enabled: readonly TKey[]
  currentTab: TKey
  onTabChange: (id: TKey) => void
  className?: string
}) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-y-2', className)}>
      {items
        .filter(({ id }) => enabled.includes(id as TKey))
        .map(({ name, icon, id, color }) => (
          <button
            key={id}
            className={clsx(
              'flex flex-1 cursor-pointer items-center justify-center gap-2 border-b-2 p-4 tracking-widest uppercase transition-all',
              currentTab === id
                ? `${
                    !color ? 'border-custom-500 text-custom-500' : ''
                  } font-medium`
                : 'border-bg-400 text-bg-400 hover:border-bg-800 hover:text-bg-800 dark:border-bg-500 dark:text-bg-500 dark:hover:border-bg-200 dark:hover:text-bg-200'
            )}
            style={
              color && currentTab === id
                ? {
                    borderColor: color,
                    color: color
                  }
                : {}
            }
            onClick={() => {
              onTabChange(id as TKey)
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
