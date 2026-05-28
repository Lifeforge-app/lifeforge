import { type ColorResult, Colorful, EditableInput } from '@uiw/react-color'
import { useEffect } from 'react'
import tinycolor from 'tinycolor2'

import { Button } from '@components/inputs'
import { ModalHeader } from '@components/overlays'
import { Box, Flex } from '@components/primitives'

import { PaletteButtons } from './components/PaletteButtons'
import { useColorPickerModalStore } from './stores/useColorPickerModalStore'

function checkContrast(hexColor: string): string {
  const r = parseInt(hexColor.substr(1, 2), 16)

  const g = parseInt(hexColor.substr(3, 2), 16)

  const b = parseInt(hexColor.substr(5, 2), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? '#000000' : '#ffffff'
}

function ColorPickerModal({
  data: { value, onChange },
  onClose
}: {
  data: {
    value: string
    onChange: (color: string) => void
  }
  onClose: () => void
}) {
  const { innerColor, setInnerColor } = useColorPickerModalStore()

  const confirmColor = () => {
    onChange(innerColor)
    onClose()
  }

  const handleColorChange = (color: ColorResult) => {
    setInnerColor(color.hex)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerColor(e.target.value)
  }

  useEffect(() => {
    setInnerColor(value.toLowerCase() || '#000000')
  }, [value])

  return (
    <Box minWidth={{ sm: '28rem' }}>
      <ModalHeader
        icon="tabler:color-picker"
        title="colorPicker.title"
        onClose={onClose}
      />
      <Colorful disableAlpha color={innerColor} onChange={handleColorChange} />
      <Box
        asChild
        mt="md"
        style={{
          // @ts-expect-error - CSS variables
          '--editable-input-bg': innerColor,
          '--editable-input-color': checkContrast(innerColor)
        }}
      >
        <EditableInput
          className="hex"
          label="Hex"
          value={innerColor}
          onChange={handleInputChange}
        />
      </Box>
      <Flex gap="md" minWidth="0" mt="md" width="100%">
        {['R', 'G', 'B'].map(type => (
          <Box key={type} asChild flex="1" style={{ minWidth: 0 }} width="100%">
            <EditableInput
              className="rgb"
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
          </Box>
        ))}
      </Flex>
      <Flex gap="md" minWidth="0" mt="md" width="100%">
        {['H', 'S', 'V'].map(type => (
          <Box key={type} asChild flex="1" style={{ minWidth: 0 }} width="100%">
            <EditableInput
              className="hsl"
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
          </Box>
        ))}
      </Flex>
      <PaletteButtons />
      <Box asChild mt="lg" width="100%">
        <Button icon="tabler:check" onClick={confirmColor}>
          Select
        </Button>
      </Box>
    </Box>
  )
}

export { ColorPickerModal }
