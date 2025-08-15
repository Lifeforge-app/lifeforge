import { ComboboxOption as HeadlessComboboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

function ComboboxOption({
  value,
  label,
  icon,
  iconAtEnd = false,
  color,
  noCheckmark = false
}: {
  value: unknown
  label: string | React.ReactElement
  icon?: string | React.ReactElement
  iconAtEnd?: boolean
  color?: string
  noCheckmark?: boolean
}) {
  return (
    <HeadlessComboboxOption
      className="flex-between hover:bg-bg-200 dark:hover:bg-bg-700/50 relative flex cursor-pointer gap-8 p-4 transition-all select-none"
      value={value}
    >
      {({ selected }: { selected: boolean }) => (
        <>
          <div
            className={clsx(
              'flex w-full items-center',
              color !== undefined ? 'gap-3' : 'gap-2',
              selected && 'text-bg-800 dark:text-bg-100 font-semibold',
              iconAtEnd && 'flex-between flex flex-row-reverse'
            )}
          >
            {icon !== undefined ? (
              <span
                className={clsx('shrink-0 rounded-md', color ? 'p-2' : 'pr-2')}
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
            <div className="w-full min-w-0 truncate">{label}</div>
          </div>
          {!noCheckmark && selected && (
            <Icon
              className="text-custom-500 block shrink-0 text-lg"
              icon="tabler:check"
            />
          )}
        </>
      )}
    </HeadlessComboboxOption>
  )
}

export default ComboboxOption
