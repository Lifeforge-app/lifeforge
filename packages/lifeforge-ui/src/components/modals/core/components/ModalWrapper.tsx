import clsx from 'clsx'
import { createPortal } from 'react-dom'

function ModalWrapper({
  isOpen,
  children,
  minWidth,
  minHeight,
  maxWidth,
  className,
  modalRef,
  zIndex = 0,
  onExited
}: {
  isOpen: boolean
  children: React.ReactNode
  minWidth?: string
  minHeight?: string
  maxWidth?: string
  className?: string
  modalRef?: React.RefObject<HTMLDivElement | null>
  zIndex?: number
  onExited?: () => void
}) {
  return createPortal(
    <div
      ref={modalRef}
      className={clsx(
        'dark:bg-bg-950/40 fixed top-0 left-0 h-dvh w-full min-w-0 overscroll-contain bg-black/10 backdrop-blur-xs transition-opacity ease-linear',
        isOpen
          ? 'opacity-100'
          : 'opacity-0 [transition:z-index_0.1s_linear_0.4s,opacity_0.1s_linear_0.1s]'
      )}
      style={{
        zIndex: isOpen ? zIndex : -1
      }}
      onTransitionEnd={onExited}
    >
      <div
        className={clsx(
          'bg-bg-100 dark:bg-bg-900 absolute top-1/2 flex max-h-[calc(100dvh-8rem)] w-full max-w-[calc(100vw-4rem)] min-w-0 translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-xl shadow-2xl transition-all duration-500 sm:max-w-[calc(100vw-8rem)] lg:w-auto',
          isOpen ? 'right-1/2' : 'right-[-100dvw]',
          className
        )}
        style={{
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: maxWidth
        }}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>,
    (document.querySelector('#app') as HTMLElement) || document.body
  )
}

export default ModalWrapper
