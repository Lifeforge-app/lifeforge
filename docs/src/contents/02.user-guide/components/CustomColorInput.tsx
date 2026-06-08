import { useEffect, useState } from 'react'

import { usePersonalization } from '@lifeforge/ui'
import {
  Box,
  Button,
  ColorInput,
  Flex,
  Icon,
  Switch,
  Text
} from '@lifeforge/ui'

function CustomColorInput() {
  const [color, setColor] = useState('#a9d066')
  const { setRawThemeColor, rawThemeColor } = usePersonalization()

  useEffect(() => {
    setColor(rawThemeColor.toUpperCase())
  }, [rawThemeColor])

  return (
    <>
      <Flex align="center" justify="between" mt="xl" py="sm">
        <Flex align="center" gap="sm">
          <Icon icon="tabler:palette" size="1.5rem" />
          <Text size="lg">Use custom color</Text>
        </Flex>
        <Switch
          value={rawThemeColor.startsWith('#')}
          onChange={() => {
            if (rawThemeColor.startsWith('#')) {
              setRawThemeColor('theme-lime')
            } else {
              setRawThemeColor('#A9D066')
            }
          }}
        />
      </Flex>
      <Box asChild mt="md">
        <ColorInput
          disabled={!rawThemeColor.startsWith('#')}
          label="Custom Color"
          value={color.startsWith('#') ? color : '#A9D066'}
          onChange={c => {
            setColor(c)
          }}
        />
      </Box>
      <Button
        disabled={!rawThemeColor.startsWith('#') || color === rawThemeColor}
        icon="tabler:check"
        mt="md"
        width="100%"
        onClick={() => {
          setRawThemeColor(color)
        }}
      >
        Apply
      </Button>
    </>
  )
}

export default CustomColorInput
