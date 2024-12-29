import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'

function DashboardItem({
  ref,
  className = '',
  icon,
  title,
  children,
  componentBesideTitle
}: {
  ref?: React.Ref<any>
  className?: string
  icon: string
  title: string
  children?: React.ReactNode
  componentBesideTitle?: React.ReactNode
}): React.ReactElement {
  const { componentBg } = useThemeColors()
  return (
    <div
      ref={ref}
      className={`${className} flex size-full flex-col gap-4 rounded-lg p-6 shadow-custom ${componentBg}`}
    >
      <div className="flex-between flex">
        <h2 className="mb-2 flex items-center gap-2 text-xl font-semibold">
          <Icon icon={icon} className="text-2xl" />
          <span className="ml-2">{title}</span>
        </h2>
        {componentBesideTitle}
      </div>
      {children}
    </div>
  )
}

export default DashboardItem
