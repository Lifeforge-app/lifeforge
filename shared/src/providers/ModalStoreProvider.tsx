import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState
} from 'react'

export type ModalComponent<P = any> = FC<{
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

const ModalContext = createContext<ModalState | null>(null)

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ModalInstance[]>([])

  const open: ModalState['open'] = (component, data) => {
    setStack(prev => [...prev, { component, data, isClosing: false }])
  }

  const close: ModalState['close'] = () => {
    setStack(prev => {
      if (prev.length === 0) return prev

      const next = [...prev]

      const lastIndex = next.length - 1

      next[lastIndex] = { ...next[lastIndex], isClosing: true } as any

      return next
    })
  }

  const remove: ModalState['remove'] = index => {
    setStack(prev => {
      const next = [...prev]

      next.splice(index, 1)

      return next
    })
  }

  const value = useMemo<ModalState>(
    () => ({ stack, open, close, remove }),
    [stack]
  )

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export function useModalStore(): ModalState {
  const ctx = useContext(ModalContext)

  if (!ctx) {
    throw new Error('ModalProvider is missing in the component tree')
  }

  return ctx
}
