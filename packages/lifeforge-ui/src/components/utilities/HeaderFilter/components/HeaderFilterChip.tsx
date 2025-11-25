import { oklchToHex } from '@components/inputs/ColorInput/ColorPickerModal/components/modals/TailwindCSSColorsModal/utils/colors'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import tinycolor from 'tinycolor2'

function FilterChip({
  icon,
  label,
  color,
  onRemove
}: {
  icon: string
  label: string
  color?: string
  onRemove: () => void
}) {
  return (
    <span
      className={clsx(
        'flex-center shadow-custom gap-1 rounded-full px-2 py-1 text-sm',
        color === undefined &&
          `text-bg-500 dark:text-bg-400 component-bg-lighter bg-bg-50`
      )}
      style={
        color !== undefined
          ? {
              backgroundColor: tinycolor(oklchToHex(color))
                .setAlpha(0.125)
                .toString(),
              color
            }
          : {}
      }
    >
      {(() => {
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
      <button onClick={onRemove}>
        <Icon className="size-4" icon="tabler:x" />
      </button>
    </span>
  )
}

export default FilterChip
