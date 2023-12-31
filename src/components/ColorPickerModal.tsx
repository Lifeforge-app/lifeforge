import React, { useState } from 'react'
import Modal from './Modal'
import { Colorful, EditableInput } from '@uiw/react-color'
import { Icon } from '@iconify/react/dist/iconify.js'

function checkContrast(hexcolor: string): string {
  const r = parseInt(hexcolor.substr(1, 2), 16)
  const g = parseInt(hexcolor.substr(3, 2), 16)
  const b = parseInt(hexcolor.substr(5, 2), 16)
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
  setColor: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const [innerColor, setInnerColor] = useState(color)

  function confirmColor(): void {
    setColor(innerColor)
    setOpen(false)
  }

  return (
    <Modal isOpen={isOpen}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:palette" className="h-7 w-7" />
          Color picker
        </h1>
        <button
          onClick={() => {
            setOpen(false)
          }}
          className="rounded-md p-2 text-neutral-500 transition-all hover:bg-neutral-800"
        >
          <Icon icon="tabler:x" className="h-6 w-6" />
        </button>
      </div>
      <Colorful
        color={innerColor}
        onChange={color => {
          setInnerColor(color.hex)
        }}
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
        onChange={color => {
          setInnerColor(color.hex)
        }}
        className="mt-4 border-0 p-4 text-2xl font-semibold"
      />
      <button
        onClick={confirmColor}
        className="flex items-center justify-center gap-2 rounded-lg bg-teal-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:bg-teal-600"
      >
        <Icon icon="tabler:check" className="h-6 w-6" />
        SELECT
      </button>
    </Modal>
  )
}

export default ColorPickerModal
