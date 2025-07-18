import { MORANDI_COLORS } from '@components/inputs/ColorInput/ColorPickerModal/modals/ModandiColorPaletteModal/constants/morandi_colors'
import { ModalHeader } from '@components/modals'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { sortFn } from 'color-sorter'
import tinycolor from 'tinycolor2'

function MorandiColorPaletteModal({
  data: { color, setColor },
  onClose
}: {
  data: {
    color: string
    setColor: React.Dispatch<React.SetStateAction<string>>
  }
  onClose: () => void
}) {
  return (
    <div className="min-w-[60vw]">
      <ModalHeader
        icon="tabler:flower"
        title="colorPicker.modals.morandiColorPalette"
        onClose={onClose}
      />
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-3 p-4 pt-0">
        {MORANDI_COLORS.sort(sortFn).map((morandiColor, index) => (
          <button
            key={index}
            className={clsx(
              'flex-center shadow-custom aspect-square size-full cursor-pointer rounded-md',
              color === morandiColor &&
                'ring-bg-900 ring-offset-bg-100 dark:ring-bg-50 dark:ring-offset-bg-900 ring-2 ring-offset-2'
            )}
            style={{ backgroundColor: morandiColor }}
            onClick={() => {
              setColor(morandiColor)
              onClose()
            }}
          >
            {color === morandiColor && (
              <Icon
                className={clsx(
                  'size-8',
                  tinycolor(morandiColor).isLight()
                    ? 'text-bg-800'
                    : 'text-bg-50'
                )}
                icon="tabler:check"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default MorandiColorPaletteModal
