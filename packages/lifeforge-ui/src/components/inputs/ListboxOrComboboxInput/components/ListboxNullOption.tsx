import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'

function ListboxNullOption({
  icon,
  value = '',
  hasBgColor = false,
  text = 'None'
}: {
  icon: string
  value?: unknown
  hasBgColor?: boolean
  text?: string
}) {
  return (
    <ListboxOption
      key="none"
      className="flex-between hover:bg-bg-200 dark:hover:bg-bg-700/50 relative flex cursor-pointer select-none p-4 transition-all"
      value={value}
    >
      {({ selected }) => (
        <>
          <div
            className={clsx(
              'flex items-center font-medium',
              hasBgColor ? 'gap-3' : 'gap-2',
              selected && 'text-bg-800 dark:text-bg-100'
            )}
          >
            <span
              className={clsx(
                'rounded-md',
                hasBgColor
                  ? 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 p-2'
                  : 'pr-2'
              )}
            >
              <Icon className="size-5" icon={icon} />
            </span>
            <span>{text}</span>
          </div>
          {selected && (
            <Icon
              className="text-custom-500 block text-lg"
              icon="tabler:check"
            />
          )}
        </>
      )}
    </ListboxOption>
  )
}

export default ListboxNullOption
