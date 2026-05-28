import { useCallback } from 'react'

import { useModalStore } from '@/providers'

import { Button } from '../../../../..'
import { Box, Flex } from '../../../../../components/primitives'
import { useColorPickerModalStore } from '../stores/useColorPickerModalStore'
import * as styles from './PaletteButtons.css'
import { FlatUIColorsModal } from './modals/FlatUIColorsModal'
import { MorandiColorPaletteModal } from './modals/ModandiColorPaletteModal'
import { TailwindCSSColorsModal } from './modals/TailwindCSSColorsModal'

export function PaletteButtons() {
  const { open } = useModalStore()

  const { innerColor, setInnerColor } = useColorPickerModalStore()

  const handleColorPaletteModalOpen = useCallback(
    (type: 'morandi' | 'tailwind' | 'flatUiColors') => () =>
      open(
        {
          morandi: MorandiColorPaletteModal,
          tailwind: TailwindCSSColorsModal,
          flatUiColors: FlatUIColorsModal
        }[type],
        {
          color: innerColor,
          setColor: setInnerColor
        }
      ),
    [innerColor]
  )

  return (
    <Flex direction="column" gap="sm" mt="lg" width="100%">
      <Box asChild width="100%">
        <Button
          icon="tabler:palette"
          namespace="common.modals"
          variant="secondary"
          onClick={handleColorPaletteModalOpen('flatUiColors')}
        >
          colorPicker.buttons.flatUiColors
        </Button>
      </Box>
      <Box asChild width="100%">
        <Button
          icon="tabler:flower"
          namespace="common.modals"
          variant="secondary"
          onClick={handleColorPaletteModalOpen('morandi')}
        >
          colorPicker.buttons.morandiColorPalette
        </Button>
      </Box>
      <Box asChild className={styles.tailwindButton} width="100%">
        <Button
          icon="tabler:brand-tailwind"
          namespace="common.modals"
          variant="primary"
          onClick={handleColorPaletteModalOpen('tailwind')}
        >
          colorPicker.buttons.tailwindCssColorPalette
        </Button>
      </Box>
    </Flex>
  )
}
