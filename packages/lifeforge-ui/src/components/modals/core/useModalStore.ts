import React from 'react'
import { create } from 'zustand'

export type ModalComponent<P = any> = React.FC<{
  data: P
  onClose: () => void
}>

type ModalInstance<P = any> = {
  component: ModalComponent<P>
  data: P
  isClosing: boolean
}

interface ModalState {
  stack: ModalInstance[]
  open: <P>(component: ModalComponent<P>, data: P) => void
  close: () => void
  remove: (index: number) => void
}

export const useModalStore = create<ModalState>((set, get) => ({
  stack: [],
  open: (component, data) => {
    set(state => ({
      stack: [...state.stack, { component, data, isClosing: false }]
    }))
  },
  close: () => {
    const { stack } = get()
    if (stack.length === 0) return
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
    })
}))
