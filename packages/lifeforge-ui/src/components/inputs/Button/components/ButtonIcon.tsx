import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { memo, useMemo } from 'react'

import { buttonIconStyle } from '../button.css'

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
  }, [icon, disabled, loading, hasChildren])

  return (
    <Icon className={clsx(buttonIconStyle, iconClassName)} icon={finalIcon} />
  )
}

export default memo(ButtonIcon)
