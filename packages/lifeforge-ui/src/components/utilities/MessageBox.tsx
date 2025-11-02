import { Icon } from '@iconify/react'
import React from 'react'

const STYLES = {
  note: {
    title: 'Note',
    icon: 'tabler:info-circle',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    before: 'before:bg-blue-500'
  },
  warning: {
    title: 'Warning',
    icon: 'tabler:alert-triangle',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-500',
    before: 'before:bg-yellow-500'
  }
}

function MessageBox({
  type,
  className,
  children
}: {
  type: 'note' | 'warning'
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`relative w-full space-y-4 rounded-md p-2 pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-[4px] before:rounded-full ${STYLES[type].before} ${className}`}
    >
      <div className="flex items-center gap-2 text-blue-500">
        <Icon className="h-6 w-6" icon={STYLES[type].icon} />
        <h4 className="text-lg font-medium">{STYLES[type].title}</h4>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default MessageBox
