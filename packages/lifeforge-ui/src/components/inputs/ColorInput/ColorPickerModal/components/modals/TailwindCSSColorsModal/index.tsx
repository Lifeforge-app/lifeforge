import colors from 'tailwindcss/colors'

import { ModalHeader } from '@components/overlays'
import { Box, Flex, Grid, Text } from '@components/primitives'

import * as styles from './TailwindCSSColorsModal.css'
import ColorItem from './components/ColorItem'

function TailwindCSSColorsModal({
  data: { color, setColor },
  onClose
}: {
  data: {
    color: string
    setColor: (color: string) => void
  }
  onClose: () => void
}) {
  return (
    <Box style={{ minWidth: '70vw' }}>
      <ModalHeader
        icon="tabler:brand-tailwind"
        title="colorPicker.modals.morandiColorPalette"
        onClose={onClose}
      />
      <Flex direction="column" style={{ gap: '0.75rem' }}>
        {([...Object.keys(colors)] as Array<keyof typeof colors>)
          .filter(
            colorGroup =>
              typeof colors[colorGroup] === 'object' &&
              ![
                'warmGray',
                'coolGray',
                'blueGray',
                'trueGray',
                'lightBlue'
              ].includes(colorGroup)
          )
          .map((colorGroup, index) => (
            <Flex key={colorGroup} direction={{ base: 'column', sm: 'row' }}>
              <Text
                as="h2"
                className={styles.colorGroupLabel}
                size={{ base: 'xl', sm: 'base' }}
                weight="medium"
              >
                {colorGroup[0].toUpperCase() + colorGroup.slice(1)}
              </Text>
              <Grid
                as="ul"
                key={index}
                columns="repeat(auto-fit, minmax(4rem, 1fr))"
                width="100%"
                style={{ gap: '0.75rem' }}
              >
                {Object.entries(
                  colors[colorGroup] as Record<string, string>
                ).map(([colorName, colorValue]) => (
                  <ColorItem
                    key={colorName}
                    name={colorName}
                    selected={color}
                    value={colorValue}
                    onSelect={color => {
                      setColor(color)
                      onClose()
                    }}
                  />
                ))}
              </Grid>
            </Flex>
          ))}
      </Flex>
    </Box>
  )
}

export default TailwindCSSColorsModal
