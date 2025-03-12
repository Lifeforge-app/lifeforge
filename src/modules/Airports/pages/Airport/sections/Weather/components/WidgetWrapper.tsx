import clsx from 'clsx'

import useComponentBg from '@hooks/useComponentBg'

function WidgetWrapper({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  const { componentBg } = useComponentBg()

  return (
    <div
      className={clsx(
        'shadow-custom flex size-full flex-col gap-4 rounded-lg p-6',
        componentBg,
        className
      )}
    >
      {children}
    </div>
  )
}

export default WidgetWrapper
