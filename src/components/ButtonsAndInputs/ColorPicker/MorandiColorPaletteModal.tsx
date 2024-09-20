import React from 'react'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { MORANDI_COLORS } from '@constants/morandi_colors'
import { rgbToHex, rgbToHsl } from '@utils/colors'

function sortColor(color1: string, color2: string): number {
  const [r1, g1, b1] = color1
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(Number)
  const hsl1 = rgbToHsl(r1, g1, b1)

  const [r2, g2, b2] = color2
    .replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(Number)

  const hsl2 = rgbToHsl(r2, g2, b2)

  return hsl1[0] - hsl2[0]
}

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
  console.log(color) // TODO
  return (
    <Modal isOpen={isOpen} affectSidebar={false} minWidth="60vw">
      <ModalHeader
        icon="tabler:flower"
        title="Morandi Color Palette"
        onClose={onClose}
      />
      <ul className="grid w-full grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] gap-4 p-4 pt-0">
        {MORANDI_COLORS.sort(sortColor).map((morandiColor, index) => (
          <li
            key={index}
            className="aspect-square size-full cursor-pointer rounded-md shadow-custom"
            style={{ backgroundColor: morandiColor }}
            onClick={() => {
              const [r, g, b] = morandiColor
                .replace('rgb(', '')
                .replace(')', '')
                .split(',')
                .map(Number)
              setColor(rgbToHex(r, g, b))
              onClose()
            }}
          />
        ))}
      </ul>
    </Modal>
  )
}

export default MorandiColorPaletteModal
