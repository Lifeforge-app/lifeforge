import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { sortFn } from 'color-sorter'
import tinycolor from 'tinycolor2'

import { ModalHeader } from '@components/overlays'
import { Box, Flex, Grid } from '@components/primitives'

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
  return (
    <Box style={{ minWidth: '60vw' }}>
      <ModalHeader
        icon="tabler:flower"
        title="colorPicker.modals.morandiColorPalette"
        onClose={onClose}
      />
      <Grid
        columns="repeat(auto-fit, minmax(4rem, 1fr))"
        pb="md"
        px="md"
        style={{ gap: '0.75rem' }}
      >
        {MORANDI_COLORS.sort(sortFn).map((morandiColor, index) => (
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
                    width: '2rem',
                    height: '2rem',
                    color: tinycolor(morandiColor).isLight()
                      ? 'var(--color-bg-800)'
                      : 'var(--color-bg-50)'
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

export default MorandiColorPaletteModal
