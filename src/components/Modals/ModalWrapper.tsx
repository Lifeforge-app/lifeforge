import React, { useEffect, useState } from 'react'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'

function ModalWrapper({
  isOpen,
  children,
  minWidth,
  minHeight,
  className,
  affectHeader: affectSidebar = true,
  modalRef
}: {
  isOpen: boolean
  children: React.ReactNode
  minWidth?: string
  minHeight?: string
  className?: string
  affectHeader?: boolean
  modalRef?: React.RefObject<HTMLDivElement | null>
}): React.ReactElement {
  const { setSubSidebarExpanded } = useGlobalStateContext()
  const [innerIsOpen, setInnerIsOpen] = useState(false)
  const [firstTime, setFirstTime] = useState(true)

  useEffect(() => {
    if (affectSidebar) {
      setSubSidebarExpanded(isOpen)
    }
  }, [isOpen, setSubSidebarExpanded])

  useEffect(() => {
    if (!isOpen && !firstTime) {
      setTimeout(() => {
        setInnerIsOpen(false)
      }, 500)
    } else {
      setInnerIsOpen(true)
    }
    setFirstTime(false)
  }, [isOpen, setInnerIsOpen, firstTime])

  return (
    <div
      ref={modalRef}
      className={`fixed left-0 top-0 h-dvh w-full overscroll-contain bg-black/10 backdrop-blur-sm transition-opacity ease-linear dark:bg-bg-950/40 ${
        isOpen
          ? 'z-[9990] opacity-100'
          : 'z-[-1] opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <div
        style={{
          minWidth: minWidth ?? '0',
          minHeight: minHeight ?? '0'
        }}
        className={`absolute ${
          isOpen ? 'right-1/2' : 'right-[-100dvw]'
        } ${className} top-1/2 flex max-h-[calc(100dvh-8rem)] w-full max-w-[calc(100vw-4rem)] -translate-y-1/2 translate-x-1/2 flex-col overflow-auto rounded-xl bg-bg-100 p-6 shadow-2xl transition-all duration-500 dark:bg-bg-900 sm:max-w-[calc(100vw-8rem)] lg:w-auto`}
      >
        {innerIsOpen && children}
      </div>
    </div>
  )
}

export default ModalWrapper
