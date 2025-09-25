import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo } from 'react'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

function EventItemButton({
  id,
  title,
  color,
  icon,
  isStrikethrough,
}: {
  id: string
  title: string
  color: string
  icon: string
  isStrikethrough?: boolean
}) {
  const { bgTempPalette } = usePersonalization()

  const finalColor = color || bgTempPalette[500]

  return (
    <button
      className={clsx(
        'bg-bg-300 dark:bg-bg-800 text-bg-600 dark:text-bg-400 flex w-full flex-row! flex-nowrap! items-start justify-between rounded-md px-[5px] py-[2px]',
        tinycolor(finalColor).isDark() && 'dark-category'
      )}
      data-tooltip-id={`calendar-event-${id}`}
      style={{
        backgroundColor: finalColor + '33',
        // @ts-expect-error - CSS variable not recognized
        '--category-color': finalColor
      }}
    >
      <div className="flex w-full min-w-0 items-center gap-2">
        {icon && (
          <Icon
            className="size-4 shrink-0"
            icon={icon ?? ''}
            style={{
              color: finalColor
            }}
          />
        )}
        <span
          className={clsx(
            'w-full min-w-0 truncate text-left',
            isStrikethrough && 'line-through decoration-[1.5px]'
          )}
          style={{
            color: finalColor
          }}
        >
          {title}
        </span>
      </div>
    </button>
  )
}

export default memo(EventItemButton)
