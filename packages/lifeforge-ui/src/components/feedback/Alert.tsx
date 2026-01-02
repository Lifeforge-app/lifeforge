import { Icon } from '@iconify/react'
import clsx from 'clsx'
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
  },
  caution: {
    title: 'Caution',
    icon: 'tabler:alert-hexagon',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-500',
    before: 'before:bg-orange-500'
  },
  tip: {
    title: 'Tip',
    icon: 'tabler:bulb',
    bgColor: 'bg-green-500',
    textColor: 'text-green-500',
    before: 'before:bg-green-500'
  },
  important: {
    title: 'Important',
    icon: 'tabler:message-exclamation',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-500',
    before: 'before:bg-purple-500'
  }
}

/**
 * Alert component to display different types of alerts such as notes, warnings, tips, and cautions.
 */
function Alert({
  type,
  className,
  children
}: {
  type: typeof STYLES extends Record<infer K, unknown> ? K : never
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`_alert relative w-full space-y-4 rounded-md p-2 pl-6 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:rounded-full ${STYLES[type].before} ${className}`}
    >
      <div className={clsx('flex items-center gap-2', STYLES[type].textColor)}>
        <Icon className="h-6 w-6" icon={STYLES[type].icon} />
        <h4 className="text-lg font-medium">{STYLES[type].title}</h4>
      </div>
      <p className="-mt-2 text-base">{children}</p>
    </div>
  )
}

export default Alert
