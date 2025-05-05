import { useEffect, useState } from 'react'

import { ModalWrapper } from '@lifeforge/ui'

import { useModalStore } from './useModalStore'

function FinalElement({ index }: { index: number }) {
  const { stack, close } = useModalStore()
  const item = stack[index]
  const { data, component: ModalComponent } = item || {}

  if (!ModalComponent) {
    return null
  }

  return <ModalComponent data={data} onClose={close} />
}

function StackModal({ index }: { index: number }) {
  const { stack, remove } = useModalStore()
  const item = stack[index]
  const { isClosing } = item || {}
  const [localOpen, setLocalOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalOpen(true)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ModalWrapper
      isOpen={localOpen && !isClosing}
      zIndex={9990 + index * 10}
      onExited={() => {
        if (isClosing) {
          remove(index)
        }
      }}
    >
      <FinalElement index={index} />
    </ModalWrapper>
  )
}

export default function ModalManager() {
  const { stack } = useModalStore()

  return (
    <>
      {stack.map((_, index) => (
        <StackModal key={`modal-${index}`} index={index} />
      ))}
    </>
  )
}
