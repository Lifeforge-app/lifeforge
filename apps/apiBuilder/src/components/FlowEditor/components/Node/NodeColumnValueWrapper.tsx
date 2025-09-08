import React from 'react'

function NodeColumnValueWrapper({ children }: { children?: React.ReactNode }) {
  return (
    <div className="border-bg-200 text-bg-600 dark:text-bg-400 disabled:text-bg-500 dark:border-bg-800 component-bg-lighter flex h-10 w-full items-center rounded-md border px-3">
      {children}
    </div>
  )
}

export default NodeColumnValueWrapper
