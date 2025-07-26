import type { ModalComponent } from '@components/modals'

import MorandiColorPaletteModal from './ModandiColorPaletteModal'
import TailwindCSSColorsModal from './TailwindCSSColorsModal'

export const ColorPickerModals: Record<string, ModalComponent> = {
  'colorPicker.tailwind': TailwindCSSColorsModal,
  'colorPicker.morandi': MorandiColorPaletteModal
}
