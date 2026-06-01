import { usePersonalization } from '@lifeforge/shared'

import { Card } from '@/components/layout'
import { ModalHeader } from '@/components/overlays'
import { Box, Flex, Grid, Icon, Text } from '@/components/primitives'

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
  const { getMostReadableColor } = usePersonalization()

  return (
    <Box style={{ minWidth: '60vw' }}>
      <ModalHeader
        icon="tabler:palette"
        title="colorPicker.modals.flatUiColors"
        onClose={onClose}
      />
      <Grid
        style={{ gap: '0.75rem' }}
        templateCols={{
          base: 1,
          sm: 'repeat(auto-fill, minmax(300px, 1fr))'
        }}
      >
        {PALETTES.map(({ name, icon, colors }) => (
          <Card key={name} bg={{ base: 'bg-100', dark: 'bg-800' }}>
            <Flex align="center" mb="md" style={{ gap: '0.75rem' }}>
              <Icon icon={icon || 'tabler:palette'} size="1.5rem" />
              <Text as="span" size="lg" weight="medium">
                {name}
              </Text>
            </Flex>
            <Grid style={{ gap: '0.5rem' }} templateCols={5}>
              {colors.map((flatUiColor, index) => (
                <Flex
                  key={index}
                  asChild
                  align="center"
                  height="100%"
                  justify="center"
                  r="md"
                  width="100%"
                >
                  <Box
                    shadow
                    as="button"
                    style={{ backgroundColor: flatUiColor, aspectRatio: 1 }}
                    onClick={() => {
                      setColor(flatUiColor)
                      onClose()
                    }}
                  >
                    {color === flatUiColor && (
                      <Icon
                        icon="tabler:check"
                        style={{
                          width: '2rem',
                          height: '2rem',
                          color: getMostReadableColor(flatUiColor)
                        }}
                      />
                    )}
                  </Box>
                </Flex>
              ))}
            </Grid>
          </Card>
        ))}
      </Grid>
    </Box>
  )
}

export { FlatUIColorsModal }
