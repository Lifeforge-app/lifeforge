import { useEffect, useState } from 'react'

import ModalWrapper from './ModalWrapper'
import { useModalStore } from './useModalStore'

function FinalRenderedElement() {
  const { isOpen, key, data, close, registry } = useModalStore()
  const [innerIsOpen, setInnerIsOpen] = useState(isOpen)

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setInnerIsOpen(isOpen)
      }, 500)
    } else {
      setInnerIsOpen(isOpen)
    }
  }, [isOpen])

  if (!innerIsOpen || !key) return null

  const ModalComponent = registry[key]

  if (!ModalComponent) {
    console.error(`Modal "${key}" is not registered.`)
    return null
  }

  return <ModalComponent data={data} onClose={close} />
}

export default function ModalManager() {
  const { isOpen } = useModalStore()

  return (
    <ModalWrapper isOpen={isOpen}>
      <FinalRenderedElement />
    </ModalWrapper>
  )
}
