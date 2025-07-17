import { type ColorResult, Colorful, EditableInput } from '@uiw/react-color'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '@components/buttons'
import { ModalHeader, useModalStore } from '@components/modals'

import MorandiColorPaletteModal from './modals/MorandiColorPaletteModal'
import TailwindCSSColorsModal from './modals/TailwindCSSColorsModal'

function checkContrast(hexColor: string): string {
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#ffffff'
}

function ColorPickerModal({
  data: { color, setColor },
  onClose
}: {
  data: {
    color: string
    setColor: (color: string) => void
  }
  onClose: () => void
}) {
  const open = useModalStore(state => state.open)
  const [innerColor, setInnerColor] = useState(color.toLowerCase() || '#000000')

  const confirmColor = () => {
    setColor(innerColor)
    onClose()
  }

  const handleColorChange = (color: ColorResult) => {
    setInnerColor(color.hex)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerColor(`#${e.target.value}`)
  }

  const handleColorPaletteModalOpen = useCallback(
    (type: 'morandi' | 'tailwind') => () =>
      open(
        type === 'morandi' ? MorandiColorPaletteModal : TailwindCSSColorsModal,
        {
          color: innerColor,
          setColor: setInnerColor
        }
      ),
    [innerColor]
  )

  useEffect(() => {
    setInnerColor(color.toLowerCase() || '#000000')
  }, [color])

  return (
    <div className="sm:min-w-[28rem]!">
      <ModalHeader
        icon="tabler:color-picker"
        title="colorPicker.title"
        onClose={onClose}
      />
      <Colorful
        disableAlpha
        className="w-full!"
        color={innerColor}
        onChange={handleColorChange}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `.w-color-editable-input input {
          background-color: ${innerColor} !important;
          color: ${checkContrast(innerColor)} !important;
        }`
        }}
      />
      <EditableInput
        className="mt-4 border-0 p-4 text-2xl font-semibold"
        label="Hex"
        value={innerColor}
        onChange={handleInputChange}
      />
      <div className="w-full space-y-2">
        <Button
          className="w-full"
          icon="tabler:flower"
          variant="secondary"
          onClick={handleColorPaletteModalOpen('morandi')}
        >
          Morandi Color Palette
        </Button>
        <Button
          className="bg-teal-500! hover:bg-teal-600! w-full"
          icon="tabler:brand-tailwind"
          variant="primary"
          onClick={handleColorPaletteModalOpen('tailwind')}
        >
          Tailwind CSS Color Palette
        </Button>
        <Button className="w-full" icon="tabler:check" onClick={confirmColor}>
          Select
        </Button>
      </div>
    </div>
  )
}

export default ColorPickerModal
