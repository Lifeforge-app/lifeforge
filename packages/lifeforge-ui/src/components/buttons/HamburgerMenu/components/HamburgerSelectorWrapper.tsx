import { Icon } from '@iconify/react'

function HamburgerSelectorWrapper({
  icon,
  title,
  children,
  className
}: {
  icon: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <span className="text-bg-500 flex items-center gap-3 p-4">
        <Icon className="size-5" icon={icon} />
        {title}
      </span>
      <div className="p-4 pt-0">
        <ul className="divide-bg-200 bg-bg-200/50 shadow-custom dark:divide-bg-700 dark:bg-bg-700/50 flex flex-col divide-y overflow-hidden rounded-md">
          {children}
        </ul>
      </div>
    </div>
  )
}

export default HamburgerSelectorWrapper
