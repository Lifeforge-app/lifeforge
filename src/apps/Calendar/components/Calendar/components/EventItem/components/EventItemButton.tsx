import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { memo } from 'react'

function EventItemButton({
  id,
  title,
  color,
  icon,
  isStrikethrough
}: {
  id: string
  title: string
  color: string
  icon: string
  isStrikethrough?: boolean
}) {
  console.log('EventItemButton', id, title, color, icon, isStrikethrough)
  return (
    <button
      className="flex w-full flex-row! flex-nowrap! items-start rounded-md px-[5px] py-[2px]"
      data-tooltip-id={`calendar-event-${id}`}
      style={{
        backgroundColor: color + '33'
      }}
    >
      <div className="flex w-full min-w-0 items-center gap-2">
        {icon && (
          <Icon
            className="size-4 shrink-0"
            icon={icon ?? ''}
            style={{
              color: color
            }}
          />
        )}
        <span
          className={clsx(
            'w-full min-w-0 truncate text-left',
            isStrikethrough && 'line-through decoration-[1.5px]'
          )}
        >
          {title}
        </span>
      </div>
    </button>
  )
}

export default memo(EventItemButton)
