import clsx from 'clsx'
import { createPortal } from 'react-dom'

function ModalWrapper({
  isOpen,
  isTopmost = true,
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
  isTopmost?: boolean
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
        'fixed top-0 left-0 h-dvh w-full min-w-0 overscroll-contain transition-opacity duration-200 ease-out',
        isTopmost
          ? 'dark:bg-bg-950/40 bg-black/10 backdrop-blur-xs will-change-[opacity,backdrop-filter]'
          : 'bg-transparent',
        isOpen
          ? 'opacity-100'
          : 'opacity-0 [transition:z-index_0.1s_linear_0.2s,opacity_0.2s_ease-out]'
      )}
      style={{
        zIndex: isOpen ? zIndex : -1
      }}
      onTransitionEnd={onExited}
    >
      <div
        className={clsx(
          'bg-bg-50 dark:bg-bg-900 border-bg-500/20 absolute top-1/2 left-1/2 flex max-h-[calc(100dvh-8rem)] w-full max-w-[calc(100vw-4rem)] min-w-0 -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-xl shadow-2xl transition-transform duration-200 ease-out will-change-transform in-[.bordered]:border-2 sm:max-w-[calc(100vw-8rem)] lg:w-auto',
          isOpen ? (isTopmost ? 'scale-100' : 'scale-95') : 'scale-90',
          className
        )}
        style={{
          minWidth: minWidth,
          minHeight: minHeight,
          maxWidth: maxWidth
        }}
      >
        <div className="min-w-0 p-6">{children}</div>
      </div>
    </div>,
    document.getElementById('app') || document.body
  )
}

export default ModalWrapper
