import { Icon } from '@iconify/react'
import { clsx } from 'clsx'
import tinycolor from 'tinycolor2'

import { Card } from '@components/layout'
import { ModalHeader } from '@components/overlays'
import { Box, Flex, Grid, Text } from '@components/primitives'

import * as styles from './FlatUIColorsModal.css'
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
  return (
    <Box style={{ minWidth: '60vw' }}>
      <ModalHeader
        icon="tabler:palette"
        title="colorPicker.modals.flatUiColors"
        onClose={onClose}
      />
      <Grid
        columns={{
          base: 'repeat(1, minmax(0, 1fr))',
          sm: 'repeat(auto-fill, minmax(300px, 1fr))'
        }}
        style={{ gap: '0.75rem' }}
      >
        {PALETTES.map(({ name, icon, colors }) => (
          <Card key={name} className={styles.card}>
            <Flex align="center" mb="md" style={{ gap: '0.75rem' }}>
              <Icon
                icon={icon || 'tabler:palette'}
                style={{ width: '1.5rem', height: '1.5rem' }}
              />
              <Text as="span" size="lg" weight="medium">
                {name}
              </Text>
            </Flex>
            <Grid columns="repeat(5, minmax(0, 1fr))" style={{ gap: '0.5rem' }}>
              {colors.map((flatUiColor, index) => (
                <Flex
                  key={index}
                  asChild
                  align="center"
                  height="100%"
                  justify="center"
                  rounded="md"
                  width="100%"
                >
                  <button
                    className={clsx(
                      styles.colorButton,
                      color === flatUiColor && styles.colorButtonSelected
                    )}
                    style={{ backgroundColor: flatUiColor }}
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
                          color: tinycolor(flatUiColor).isLight()
                            ? 'var(--color-bg-800)'
                            : 'var(--color-bg-50)'
                        }}
                      />
                    )}
                  </button>
                </Flex>
              ))}
            </Grid>
          </Card>
        ))}
      </Grid>
    </Box>
  )
}

export default FlatUIColorsModal
