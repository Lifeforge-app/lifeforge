import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { converter, formatHex, parse } from 'culori/fn'
import tinycolor from 'tinycolor2'

function TagChip({
  label,
  icon,
  color,
  actionButtonProps,
  onClick
}: {
  label: string
  icon?: string
  color?: string
  actionButtonProps?: {
    icon: string
    onClick: () => void
  }
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}) {
  return (
    <span
      className={clsx(
        'flex-center shadow-custom shrink-0 gap-1 rounded-full border px-3 py-1 text-sm whitespace-nowrap!',
        color === undefined &&
          `text-bg-500 dark:text-bg-400 border-bg-200 dark:border-bg-700/50 component-bg-lighter bg-bg-50`,
        onClick !== undefined &&
          'cursor-pointer transition-all hover:brightness-120'
      )}
      style={
        color !== undefined
          ? {
              borderColor: tinycolor(formatHex(converter('rgb')(parse(color))))
                .setAlpha(0.25)
                .toString(),
              backgroundColor: tinycolor(
                formatHex(converter('rgb')(parse(color)))
              )
                .setAlpha(0.125)
                .toString(),
              color
            }
          : {}
      }
      onClick={onClick}
    >
      {(() => {
        if (!icon) return null

        if (icon.startsWith('customHTML:')) {
          if (icon.replace(/^customHTML:/, '') === '') return null

          return (
            <span
              className="size-4"
              dangerouslySetInnerHTML={{
                __html: icon.replace(/^customHTML:/, '')
              }}
            />
          )
        } else {
          return <Icon className="size-4" icon={icon} />
        }
      })()}
      {label}
      {actionButtonProps && (
        <button onClick={actionButtonProps.onClick}>
          <Icon className="size-4" icon={actionButtonProps.icon} />
        </button>
      )}
    </span>
  )
}

export default TagChip
