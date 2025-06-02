import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { memo } from 'react'
import tinycolor from 'tinycolor2'

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
  return (
    <button
      className={clsx(
        'flex w-full flex-row! flex-nowrap! items-start rounded-md px-[5px] py-[2px]',
        tinycolor(color).isDark() && 'dark-category'
      )}
      data-tooltip-id={`calendar-event-${id}`}
      style={{
        backgroundColor: color + '33',
        // @ts-expect-error - CSS variable not recognized
        '--category-color': color
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
          style={{
            color: color
          }}
        >
          {title}
        </span>
      </div>
    </button>
  )
}

export default memo(EventItemButton)
