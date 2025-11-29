import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { formatHex, parse } from 'culori'
import { usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

interface TagChipProps {
  /** The text label displayed on the tag chip. */
  label: string
  /** The icon to display alongside the label. Can be an Iconify icon name or custom HTML string prefixed with 'customHTML:'. */
  icon?: string
  /** The color of the tag chip. If provided, it customizes the text, border and background colors. */
  color?: string
  /** Optional action button properties, including icon and click handler.
   * If provided, an action button will be displayed at the end of the tag chip. */
  variant?: 'outlined' | 'filled'
  actionButtonProps?: {
    icon: string
    onClick?: () => void
  }
  /** Optional click handler for the entire tag chip. */
  onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void
}

const CLASSNAMES_WITHOUT_COLOR = {
  outlined:
    'text-bg-500 dark:text-bg-400 border-bg-200 dark:border-bg-700/50 component-bg-lighter bg-bg-50',
  filled:
    'bg-bg-600 dark:bg-bg-400 dark:text-bg-900 text-bg-100 border-transparent'
}

/**
 * A tag chip component that displays a label with an optional icon and customizable color.
 */
function TagChip({
  label,
  icon,
  color,
  variant = 'outlined',
  actionButtonProps,
  onClick
}: TagChipProps) {
  const { bgTempPalette } = usePersonalization()

  const convertedColor = color?.startsWith('oklch(')
    ? formatHex(formatHex(parse(color)))
    : color

  return (
    <span
      className={clsx(
        'flex-center shadow-custom shrink-0 gap-1 rounded-full border px-3 py-1 text-sm whitespace-nowrap!',
        color === undefined && CLASSNAMES_WITHOUT_COLOR[variant],
        onClick !== undefined &&
          'cursor-pointer transition-all hover:brightness-120'
      )}
      style={
        convertedColor !== undefined
          ? variant === 'outlined'
            ? {
                borderColor: tinycolor(convertedColor)
                  .setAlpha(0.25)
                  .toString(),
                backgroundColor: tinycolor(convertedColor)
                  .setAlpha(0.125)
                  .toString(),
                color
              }
            : {
                backgroundColor: convertedColor,
                color: tinycolor(convertedColor).isLight()
                  ? bgTempPalette[800]
                  : bgTempPalette[100],
                border: 'none'
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
        <>
          <span className="w-1" />
          <button onClick={actionButtonProps.onClick}>
            <Icon className="size-4" icon={actionButtonProps.icon} />
          </button>
        </>
      )}
    </span>
  )
}

export default TagChip
