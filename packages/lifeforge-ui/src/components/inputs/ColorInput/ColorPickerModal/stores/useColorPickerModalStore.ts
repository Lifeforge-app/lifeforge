import { create } from 'zustand'

interface ColorPickerModalState {
  innerColor: string
  setInnerColor: (color: string) => void
}

export const useColorPickerModalStore = create<ColorPickerModalState>()(
  set => ({
    innerColor: '#000000',
    setInnerColor: (color: string) => set({ innerColor: color })
  })
)
