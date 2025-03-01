import clsx from 'clsx'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

function WidgetWrapper({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div
      className={clsx(
        'flex size-full flex-col gap-4 rounded-lg p-6 shadow-custom',
        componentBg,
        className
      )}
    >
      {children}
    </div>
  )
}

export default WidgetWrapper
