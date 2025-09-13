import React, { useCallback } from 'react'

import { Button, useModalStore } from '../../../../..'
import { useColorPickerModalStore } from '../stores/useColorPickerModalStore'
import MorandiColorPaletteModal from './modals/ModandiColorPaletteModal'
import TailwindCSSColorsModal from './modals/TailwindCSSColorsModal'

function PaletteButtons() {
  const open = useModalStore(state => state.open)

  const { innerColor, setInnerColor } = useColorPickerModalStore()

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

  return (
    <div className="mt-6 w-full space-y-2">
      <Button
        className="w-full"
        icon="tabler:flower"
        namespace="common.modals"
        variant="secondary"
        onClick={handleColorPaletteModalOpen('morandi')}
      >
        colorPicker.buttons.morandiColorPalette
      </Button>
      <Button
        className="w-full bg-teal-500! hover:bg-teal-600!"
        icon="tabler:brand-tailwind"
        namespace="common.modals"
        variant="primary"
        onClick={handleColorPaletteModalOpen('tailwind')}
      >
        colorPicker.buttons.tailwindCssColorPalette
      </Button>
    </div>
  )
}

export default PaletteButtons
