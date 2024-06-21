import React from 'react'

function Modal({
  isOpen,
  children,
  minWidth,
  minHeight,
  className
}: {
  isOpen: boolean
  children: React.ReactNode
  minWidth?: string
  minHeight?: string
  className?: string
}): React.ReactElement {
  return (
    <div
      className={`fixed left-0 top-0 h-dvh w-full bg-bg-950/60 backdrop-blur-md transition-opacity ease-linear ${
        isOpen
          ? 'z-[9999] opacity-100'
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
        } ${className} top-1/2 flex max-h-[calc(100dvh-8rem)] w-full max-w-[calc(100vw-4rem)] -translate-y-1/2 translate-x-1/2 flex-col overflow-auto rounded-xl bg-bg-100 p-6 transition-all duration-500 dark:bg-bg-900 sm:max-w-[calc(100vw-8rem)] lg:w-auto`}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
