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
      className={`${className} flex size-full flex-col gap-4 rounded-lg p-6 shadow-custom ${componentBg}`}
    >
      {children}
    </div>
  )
}

export default WidgetWrapper
