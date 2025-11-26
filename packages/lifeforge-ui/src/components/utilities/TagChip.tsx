import { oklchToHex } from '@components/inputs/ColorInput/ColorPickerModal/components/modals/TailwindCSSColorsModal/utils/colors'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import tinycolor from 'tinycolor2'

function TagChip({
  label,
  icon,
  color,
  actionButtonProps
}: {
  label: string
  icon?: string
  color?: string
  actionButtonProps?: {
    icon: string
    onClick: () => void
  }
}) {
  return (
    <span
      className={clsx(
        'flex-center shadow-custom gap-1 rounded-full border px-3 py-1 text-sm',
        color === undefined &&
          `text-bg-500 dark:text-bg-400 border-bg-200 dark:border-bg-700/50 component-bg-lighter bg-bg-50`
      )}
      style={
        color !== undefined
          ? {
              borderColor: tinycolor(oklchToHex(color))
                .setAlpha(0.25)
                .toString(),
              backgroundColor: tinycolor(oklchToHex(color))
                .setAlpha(0.125)
                .toString(),
              color
            }
          : {}
      }
    >
      {(() => {
        if (!icon) return null

        if (icon.startsWith('customHTML:')) {
          return (
            <span
              className="size-4"
              dangerouslySetInnerHTML={{
                __html: icon.replace('customHTML:', '')
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
