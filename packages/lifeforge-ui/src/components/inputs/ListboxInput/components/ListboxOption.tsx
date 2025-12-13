import { ListboxOption as HeadlessListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { formatHex, parse } from 'culori'

function ListboxOption({
  value,
  label,
  icon,
  iconAtEnd = false,
  color,
  noCheckmark = false,
  className,
  renderColorAndIcon,
  style,
  selected,
  onClick
}: {
  value: unknown
  label: string | React.ReactElement
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
  onClick?: () => void
}) {
  const convertedColor = color?.startsWith('oklch(')
    ? formatHex(parse(color))
    : color

  return (
    <HeadlessListboxOption
      className={clsx(
        'flex-between hover:bg-bg-200 dark:hover:bg-bg-700/50 relative flex w-full min-w-0 cursor-pointer gap-3 p-5 transition-all select-none',
        className
      )}
      style={style}
      value={value}
      onClick={onClick}
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
                          backgroundColor: convertedColor + '20',
                          color
                        }
                      : {}
                  }
                >
                  {typeof icon === 'string' ? (
                    icon.startsWith('customHTML:') ? (
                      <span
                        className="block size-5 shrink-0"
                        dangerouslySetInnerHTML={{
                          __html: icon.replace('customHTML:', '')
                        }}
                      />
                    ) : (
                      <Icon className="size-5 shrink-0" icon={icon} />
                    )
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
              <div className="w-full min-w-0 truncate">{label}</div>
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
