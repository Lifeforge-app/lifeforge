import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

function ButtonIcon({
  icon,
  disabled,
  loading,
  iconClassName,
  hasChildren
}: {
  icon: string
  disabled?: boolean
  loading?: boolean
  iconClassName?: string
  hasChildren?: boolean
}) {
  const finalIcon = useMemo(() => {
    if (loading) {
      return 'svg-spinners:ring-resize'
    }

    if (disabled && hasChildren) {
      return 'tabler:ban'
    }

    return icon
  }, [icon, disabled, loading])

  return (
    <Icon className={clsx('size-5 shrink-0', iconClassName)} icon={finalIcon} />
  )
}

export default memo(ButtonIcon)
