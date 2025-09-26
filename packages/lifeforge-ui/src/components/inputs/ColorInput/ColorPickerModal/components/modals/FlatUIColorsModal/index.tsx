import { ItemWrapper } from '@components/layouts'
import { ModalHeader } from '@components/modals'
import { Icon } from '@iconify/react/dist/iconify.js'
import { clsx } from 'clsx'
import tinycolor from 'tinycolor2'

import PALETTES from './constants/palettes.json'

function FlatUIColorsModal({
  onClose,
  data: { color, setColor }
}: {
  onClose: () => void
  data: {
    color: string
    setColor: (color: string) => void
  }
}) {
  return (
    <div className="min-w-[60vw]">
      <ModalHeader
        icon="tabler:palette"
        title="colorPicker.modals.flatUiColors"
        onClose={onClose}
      />
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {PALETTES.map(({ name, icon, colors }) => (
          <ItemWrapper key={name} className="dark:bg-bg-800/70 space-y-2">
            <div className="mb-4 flex items-center space-x-3">
              <Icon className="size-6" icon={icon || 'tabler:palette'} />
              <span className="text-lg font-medium">{name}</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((flatUiColor, index) => (
                <button
                  key={index}
                  className={`flex-center shadow-custom aspect-square size-full cursor-pointer rounded-md ${
                    color === flatUiColor &&
                    'ring-bg-900 ring-offset-bg-100 dark:ring-bg-50 dark:ring-offset-bg-900 ring-2 ring-offset-2'
                  }`}
                  style={{ backgroundColor: flatUiColor }}
                  onClick={() => {
                    setColor(flatUiColor)
                    onClose()
                  }}
                >
                  {color === flatUiColor && (
                    <Icon
                      className={clsx(
                        'size-8',
                        tinycolor(flatUiColor).isLight()
                          ? 'text-bg-800'
                          : 'text-bg-50'
                      )}
                      icon="tabler:check"
                    />
                  )}
                </button>
              ))}
            </div>
          </ItemWrapper>
        ))}
      </div>
    </div>
  )
}

export default FlatUIColorsModal
