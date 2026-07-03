import { useEffect, useMemo, useState } from 'react'

import { useModalStore } from '@/providers'
import type { ModalInstance } from '@/providers/ModalProvider'

import { ModalWrapper } from '../ModalWrapper'

function FinalElement({
  item,
  onClose
}: {
  item: ModalInstance
  onClose: () => void
}) {
  const { data, component: ModalComponent } = item

  return <ModalComponent data={data} onClose={onClose} />
}

function StackModal({ item }: { item: ModalInstance }) {
  const { stack, close, remove } = useModalStore()

  const { id, isClosing } = item

  const [localOpen, setLocalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalOpen(true)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  const isTopmost = useMemo(() => {
    const topmostIndex = stack.findLastIndex(modal => !modal.isClosing)

    return topmostIndex !== -1 && stack[topmostIndex].id === id
  }, [stack, id])

  const zIndex = useMemo(() => {
    const index = stack.findIndex(modal => modal.id === id)

    return (index === -1 ? 0 : index) * 10 + 500
  }, [stack, id])

  const onClose = () => close(id)

  return (
    <ModalWrapper
      isOpen={localOpen && !isClosing}
      isTopmost={isTopmost}
      zIndex={zIndex}
      onExited={() => {
        if (isClosing) {
          remove(id)
        }
      }}
    >
      <FinalElement item={item} onClose={onClose} />
    </ModalWrapper>
  )
}

export function ModalManager() {
  const { stack } = useModalStore()

  return (
    <>
      {stack.map(item => (
        <StackModal key={item.id} item={item} />
      ))}
    </>
  )
}
