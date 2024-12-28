import { Colorful, type ColorResult, EditableInput } from '@uiw/react-color'
import React, { useCallback, useEffect, useState } from 'react'
import ModalHeader from '@components/Modals/ModalHeader'
import MorandiColorPaletteModal from './MorandiColorPaletteModal'
import TailwindCSSColorsModal from './TailwindCSSColorsModal'
import ModalWrapper from '../../Modals/ModalWrapper'
import Button from '../Button'

function checkContrast(hexColor: string): string {
  const r = parseInt(hexColor.substr(1, 2), 16)
  const g = parseInt(hexColor.substr(3, 2), 16)
  const b = parseInt(hexColor.substr(5, 2), 16)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? '#000000' : '#ffffff'
}

function ColorPickerModal({
  isOpen,
  setOpen,
  color,
  setColor
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  color: string
  setColor: (color: string) => void
}): React.ReactElement {
  const [innerColor, setInnerColor] = useState(color.toLowerCase())
  const [morandiColorPaletteModalOpen, setMorandiColorPaletteModalOpen] =
    useState(false)
  const [tailwindCSSColorsModalOpen, setTailwindCSSColorsModalOpen] =
    useState(false)

  const confirmColor = useCallback(() => {
    setColor(innerColor)
    setOpen(false)
  }, [innerColor, setColor, setOpen])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleColorChange = useCallback((color: ColorResult) => {
    setInnerColor(color.hex)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInnerColor(`#${e.target.value}`)
    },
    []
  )

  useEffect(() => {
    setInnerColor(color.toLowerCase())
  }, [color])

  return (
    <>
      <ModalWrapper
        affectHeader={false}
        isOpen={isOpen}
        className="sm:!min-w-[28rem]"
      >
        <ModalHeader
          title="Pick a color"
          icon="tabler:color-picker"
          onClose={handleClose}
        />
        <Colorful
          color={innerColor}
          onChange={handleColorChange}
          disableAlpha
          className="!w-full"
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
          label="Hex"
          value={innerColor}
          onChange={handleInputChange}
          className="mt-4 border-0 p-4 text-2xl font-semibold"
        />
        <Button
          variant="secondary"
          icon="tabler:flower"
          onClick={() => {
            setMorandiColorPaletteModalOpen(true)
          }}
          className="mb-2"
        >
          Morandi Color Palette
        </Button>
        <Button
          variant="primary"
          icon="tabler:brand-tailwind"
          onClick={() => {
            setTailwindCSSColorsModalOpen(true)
          }}
          className="mb-2 !bg-teal-500 hover:!bg-teal-600"
        >
          Tailwind CSS Color Palette
        </Button>
        <Button onClick={confirmColor} icon="tabler:check">
          Select
        </Button>
      </ModalWrapper>
      <MorandiColorPaletteModal
        isOpen={morandiColorPaletteModalOpen}
        onClose={() => {
          setMorandiColorPaletteModalOpen(false)
        }}
        color={innerColor}
        setColor={setInnerColor}
      />
      <TailwindCSSColorsModal
        isOpen={tailwindCSSColorsModalOpen}
        onClose={() => {
          setTailwindCSSColorsModalOpen(false)
        }}
        color={innerColor}
        setColor={setInnerColor}
      />
    </>
  )
}

export default ColorPickerModal
