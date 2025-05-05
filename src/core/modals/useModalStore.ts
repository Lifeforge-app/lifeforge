/* eslint-disable sonarjs/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand'

export type ModalComponent<P = any> = React.ComponentType<{
  data: P
  onClose: () => void
}>

type ModalInstance = {
  key: string
  data: any
  component: ModalComponent<any>
  isClosing: boolean
}

interface ModalState {
  stack: ModalInstance[]
  registry: Record<string, ModalComponent<any>>
  open: <P = any>(key: string, data: P) => void
  close: () => void
  remove: (index: number) => void
  register: <P = any>(key: string, component: ModalComponent<P>) => void
  unregister: (key: string) => void
}

export const useModalStore = create<ModalState>((set, get) => ({
  stack: [],
  registry: {},
  open: (key, data) => {
    const component = get().registry[key]
    if (!component) {
      console.error(`Modal "${key}" is not registered.`)
      return
    }
    set(state => ({
      stack: [...state.stack, { key, data, component, isClosing: false }]
    }))
  },
  close: () => {
    if (get().stack.length === 0) {
      console.warn('No modals to close.')
      return
    }

    set(state => {
      const newStack = [...state.stack]
      const lastIndex = newStack.length - 1

      if (lastIndex >= 0) {
        newStack[lastIndex] = {
          ...newStack[lastIndex],
          isClosing: true
        }
      }

      return { stack: newStack }
    })
  },
  remove: (index: number) =>
    set(state => {
      const newStack = [...state.stack]
      newStack.splice(index, 1)
      return { stack: newStack }
    }),
  register: (key, component) =>
    set(state => {
      if (state.registry[key]) {
        console.warn(`Modal "${key}" is already registered.`)
      }
      return {
        registry: { ...state.registry, [key]: component }
      }
    }),
  unregister: key =>
    set(state => {
      if (!state.registry[key]) {
        console.warn(`Modal "${key}" is not registered.`)
      }
      const { [key]: _, ...rest } = state.registry
      return {
        registry: rest,
        stack: state.stack.filter(modal => modal.key !== key)
      }
    })
}))
