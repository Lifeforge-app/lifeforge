import clsx from 'clsx'

import { ModalHeader } from '@/components/overlays'
import { Box, Flex, Grid, Icon } from '@/components/primitives'
import { usePersonalization } from '@/providers'

import * as styles from './MorandiColorPaletteModal.css'
import { MORANDI_COLORS } from './constants/morandi_colors'

function MorandiColorPaletteModal({
  data: { color, setColor },
  onClose
}: {
  data: {
    color: string
    setColor: (color: string) => void
  }
  onClose: () => void
}) {
  const { getMostReadableColor } = usePersonalization()

  return (
    <Box style={{ minWidth: '60vw' }}>
      <ModalHeader
        icon="tabler:flower"
        title="colorPicker.modals.morandiColorPalette"
        onClose={onClose}
      />
      <Grid
        pb="md"
        px="md"
        style={{ gap: '0.75em' }}
        templateCols="repeat(auto-fit, minmax(4em, 1fr))"
      >
        {MORANDI_COLORS.map((morandiColor, index) => (
          <Flex key={index} asChild centered r="md">
            <button
              className={clsx(
                styles.colorButton,
                color === morandiColor && styles.colorButtonSelected
              )}
              style={{ backgroundColor: morandiColor }}
              onClick={() => {
                setColor(morandiColor)
                onClose()
              }}
            >
              {color === morandiColor && (
                <Icon
                  icon="tabler:check"
                  style={{
                    width: '2em',
                    height: '2em',
                    color: getMostReadableColor(morandiColor)
                  }}
                />
              )}
            </button>
          </Flex>
        ))}
      </Grid>
    </Box>
  )
}

export { MorandiColorPaletteModal }
