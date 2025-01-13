import { Icon } from '@iconify/react'
import { sortFn } from 'color-sorter'
import React from 'react'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import { MORANDI_COLORS } from '@constants/morandi_colors'
import { isLightColor } from '@utils/colors'

function MorandiColorPaletteModal({
  isOpen,
  onClose,
  color,
  setColor
}: {
  isOpen: boolean
  onClose: () => void
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  return (
    <ModalWrapper isOpen={isOpen} minWidth="60vw">
      <ModalHeader
        icon="tabler:flower"
        title="Morandi Color Palette"
        onClose={onClose}
      />
      <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-4 p-4 pt-0">
        {MORANDI_COLORS.sort(sortFn).map((morandiColor, index) => (
          <li
            key={index}
            className={`flex-center aspect-square size-full cursor-pointer rounded-md shadow-custom ${
              color === morandiColor
                ? 'ring-2 ring-bg-900 ring-offset-2 ring-offset-bg-100 dark:ring-bg-50 dark:ring-offset-bg-900'
                : ''
            }`}
            style={{ backgroundColor: morandiColor }}
            onClick={() => {
              setColor(morandiColor)
              onClose()
            }}
          >
            {color === morandiColor && (
              <Icon
                icon="tabler:check"
                className={`size-8 ${
                  isLightColor(morandiColor) ? 'text-bg-800' : 'text-bg-50'
                }`}
              />
            )}
          </li>
        ))}
      </ul>
    </ModalWrapper>
  )
}

export default MorandiColorPaletteModal
