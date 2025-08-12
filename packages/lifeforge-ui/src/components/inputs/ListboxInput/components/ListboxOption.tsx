import { ListboxOption as HeadlessListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

function ListboxOption({
  value,
  text,
  icon,
  iconAtEnd = false,
  color,
  noCheckmark = false,
  className,
  renderColorAndIcon,
  style,
  selected
}: {
  value: unknown
  text: string | React.ReactElement
  icon?: string | React.ReactElement
  iconAtEnd?: boolean
  color?: string
  noCheckmark?: boolean
  className?: string
  renderColorAndIcon?: (params: {
    color?: string
    icon?: string | React.ReactElement
  }) => React.ReactNode
  style?: React.CSSProperties
  selected?: boolean
}) {
  return (
    <HeadlessListboxOption
      className={clsx(
        'flex-between hover:bg-bg-200 dark:hover:bg-bg-700/50 relative flex w-full min-w-0 cursor-pointer gap-4 p-5 transition-all select-none',
        className
      )}
      style={style}
      value={value}
    >
      {({ selected: innerSelected }) => {
        const finalSelected =
          typeof selected === 'boolean' ? selected : innerSelected

        return (
          <>
            <div
              className={clsx(
                'flex w-full min-w-0 items-center',
                color !== undefined ? 'gap-3' : 'gap-2',
                finalSelected && 'text-bg-800 dark:text-bg-100 font-semibold',
                iconAtEnd && 'flex-between flex flex-row-reverse'
              )}
            >
              {renderColorAndIcon ? (
                renderColorAndIcon({ color, icon })
              ) : icon !== undefined ? (
                <span
                  className={clsx(
                    'shrink-0 rounded-md',
                    color ? 'p-2' : 'pr-2'
                  )}
                  style={
                    color !== undefined
                      ? {
                          backgroundColor: color + '20',
                          color
                        }
                      : {}
                  }
                >
                  {typeof icon === 'string' ? (
                    <Icon className="size-5 shrink-0" icon={icon} />
                  ) : (
                    icon
                  )}
                </span>
              ) : (
                color !== undefined && (
                  <span
                    className="border-bg-200 dark:border-bg-700 block size-4 shrink-0 rounded-full border"
                    style={{ backgroundColor: color }}
                  />
                )
              )}
              <div className="w-full min-w-0 truncate">{text}</div>
            </div>
            {!noCheckmark && finalSelected && (
              <Icon
                className="text-bg-800 dark:text-bg-100 block shrink-0 text-lg"
                icon="tabler:check"
              />
            )}
          </>
        )
      }}
    </HeadlessListboxOption>
  )
}

export default ListboxOption
