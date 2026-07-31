import { memo, useMemo } from 'react'

import { Icon, type IconProps } from '@/components/primitives'

function _ButtonIcon({
  icon,
  disabled,
  loading,
  hasChildren,
  ...rest
}: {
  disabled?: boolean
  loading?: boolean
  iconStyle?: React.CSSProperties
  hasChildren?: boolean
} & IconProps) {
  const finalIcon = useMemo(() => {
    if (loading) {
      return 'svg-spinners:ring-resize'
    }

    if (disabled && hasChildren) {
      return 'tabler:ban'
    }

    return icon
  }, [icon, disabled, loading, hasChildren])

  return <Icon {...rest} icon={finalIcon} />
}

export const ButtonIcon = memo(_ButtonIcon)
