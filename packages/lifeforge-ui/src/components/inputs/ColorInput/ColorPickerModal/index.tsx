import { Button } from '@components/buttons'
import { ModalHeader, useModalStore } from '@components/modals'
import { type ColorResult, Colorful, EditableInput } from '@uiw/react-color'
import { useCallback, useEffect, useState } from 'react'
import tinycolor from 'tinycolor2'

import MorandiColorPaletteModal from './modals/ModandiColorPaletteModal'
import TailwindCSSColorsModal from './modals/TailwindCSSColorsModal'

function checkContrast(hexColor: string): string {
  const r = parseInt(hexColor.substr(1, 2), 16)

  const g = parseInt(hexColor.substr(3, 2), 16)

  const b = parseInt(hexColor.substr(5, 2), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? '#000000' : '#ffffff'
}

function ColorPickerModal({
  data: { value, setValue },
  onClose
}: {
  data: {
    value: string
    setValue: (color: string) => void
  }
  onClose: () => void
}) {
  const open = useModalStore(state => state.open)

  const [innerColor, setInnerColor] = useState(value.toLowerCase() || '#000000')

  const confirmColor = () => {
    setValue(innerColor)
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
    setInnerColor(value.toLowerCase() || '#000000')
  }, [value])

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
          __html: `.w-color-editable-input.hex input {
          background-color: ${innerColor} !important;
          color: ${checkContrast(innerColor)} !important;
        }`
        }}
      />
      <EditableInput
        className="hex mt-4 border-0 text-2xl font-semibold"
        label="Hex"
        value={innerColor}
        onChange={handleInputChange}
      />
      <div className="mt-4 flex w-full min-w-0 gap-4">
        {['R', 'G', 'B'].map(type => (
          <EditableInput
            key={type}
            className="rgb w-full min-w-0 flex-1 border-0 text-2xl font-semibold"
            label={type}
            value={tinycolor(innerColor)
              .toRgb()
              [type.toLowerCase() as 'r' | 'g' | 'b'].toString()}
            onChange={e => {
              const oldColor = tinycolor(innerColor).toRgb()

              const newColor =
                type === 'R'
                  ? tinycolor({
                      r: Number(e.target.value),
                      g: oldColor.g,
                      b: oldColor.b
                    })
                  : type === 'G'
                    ? tinycolor({
                        r: oldColor.r,
                        g: Number(e.target.value),
                        b: oldColor.b
                      })
                    : tinycolor({
                        r: oldColor.r,
                        g: oldColor.g,
                        b: Number(e.target.value)
                      })

              setInnerColor(newColor.toHexString())
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex w-full min-w-0 gap-4">
        {['H', 'S', 'V'].map(type => (
          <EditableInput
            key={type}
            className="hsl w-full min-w-0 flex-1 border-0 text-2xl font-semibold"
            label={type}
            value={(
              tinycolor(innerColor).toHsv()[
                type.toLowerCase() as 'h' | 's' | 'v'
              ] * (type === 'H' ? 1 : 100)
            ).toFixed(type === 'H' ? 0 : 2)}
            onChange={e => {
              const oldColor = tinycolor(innerColor).toHsv()

              const newColor =
                type === 'H'
                  ? tinycolor({
                      h: Number(e.target.value),
                      s: oldColor.s,
                      v: oldColor.v
                    })
                  : type === 'S'
                    ? tinycolor({
                        h: oldColor.h,
                        s: Number(e.target.value) / 100,
                        v: oldColor.v
                      })
                    : tinycolor({
                        h: oldColor.h,
                        s: oldColor.s,
                        v: Number(e.target.value) / 100
                      })

              setInnerColor(newColor.toHexString())
            }}
          />
        ))}
      </div>
      <div className="mt-6 w-full space-y-2">
        <Button
          className="w-full"
          icon="tabler:flower"
          variant="secondary"
          onClick={handleColorPaletteModalOpen('morandi')}
        >
          Morandi Color Palette
        </Button>
        <Button
          className="w-full bg-teal-500! hover:bg-teal-600!"
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
