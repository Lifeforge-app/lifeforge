/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sonarjs/no-unused-vars */
import { create } from 'zustand'

export type ModalComponent<P = any> = React.ComponentType<{
  data: P
  onClose: () => void
}>

interface ModalState {
  isOpen: boolean
  key: string | null
  data: any
  registry: Record<string, ModalComponent<any>>
  open: <P = any>(key: string, data: P) => void
  close: () => void
  register: <P = any>(key: string, component: ModalComponent<P>) => void
  unregister: (key: string) => void
}

export const useModalStore = create<ModalState>(set => ({
  isOpen: false,
  key: null,
  data: null,
  registry: {},
  open: (key, data) => set({ isOpen: true, key, data }),
  close: () => {
    set({ isOpen: false })

    setTimeout(() => {
      set({ key: null, data: null })
    }, 500)
  },
  register: (key, component) =>
    set(state => ({
      registry: { ...state.registry, [key]: component }
    })),
  unregister: key =>
    set(state => {
      const { [key]: _, ...rest } = state.registry
      return { registry: rest }
    })
}))
