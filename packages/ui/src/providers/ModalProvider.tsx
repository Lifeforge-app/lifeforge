import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'

export type ModalComponent<P = any> = FC<{
  data: P
  onClose: () => void
}>

export type ModalInstance<P = any> = {
  id: string
  component: ModalComponent<P>
  data: P
  isClosing: boolean
}

interface ModalState {
  stack: ModalInstance[]
  open: <P>(component: ModalComponent<P>, data: P) => void
  close: (id: string) => void
  remove: (id: string) => void
}

const ModalContext = createContext<ModalState | null>(null)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ModalInstance[]>([])
  const idCounter = useRef(0)

  const open: ModalState['open'] = (component, data) => {
    const id = String(idCounter.current++)
    setStack(prev => [...prev, { id, component, data, isClosing: false }])
  }

  const close: ModalState['close'] = useCallback((id: string) => {
    setStack(prev => {
      const index = prev.findIndex(entry => entry.id === id)

      if (index === -1) return prev

      const next = [...prev]
      next[index] = { ...next[index], isClosing: true }

      return next
    })
  }, [])

  const remove: ModalState['remove'] = useCallback((id: string) => {
    setStack(prev => {
      const index = prev.findIndex(entry => entry.id === id)

      if (index === -1) return prev

      const next = [...prev]
      next.splice(index, 1)

      return next
    })
  }, [])

  const value = useMemo<ModalState>(
    () => ({ stack, open, close, remove }),
    [stack, close, remove]
  )

  return <ModalContext value={value}>{children}</ModalContext>
}

export function useModalStore(): ModalState {
  const ctx = useContext(ModalContext)

  if (!ctx) {
    throw new Error('ModalProvider is missing in the component tree')
  }

  return ctx
}
