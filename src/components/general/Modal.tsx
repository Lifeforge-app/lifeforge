import React from 'react'

function Modal({
  isOpen,
  children
}: {
  isOpen: boolean
  children: React.ReactNode
}): React.ReactElement {
  return (
    <div
      className={`fixed left-0 top-0 h-[100dvh] w-full bg-bg-950/60 backdrop-blur-md transition-opacity ease-linear ${
        isOpen
          ? 'z-[9999] opacity-100'
          : 'z-[-1] opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <div
        className={`absolute ${
          isOpen ? 'top-1/2' : 'top-[200dvh]'
        } left-1/2 flex max-h-[calc(100dvh-8rem)] w-full max-w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-scroll rounded-xl bg-bg-100 p-6 transition-all duration-300 dark:bg-bg-900 sm:max-w-[calc(100vw-8rem)] lg:w-auto`}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
