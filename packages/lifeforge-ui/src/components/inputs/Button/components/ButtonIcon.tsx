import { Icon } from '@iconify/react'
import { memo, useMemo } from 'react'

function ButtonIcon({
  icon,
  disabled,
  loading,
  iconStyle,
  hasChildren
}: {
  icon: string
  disabled?: boolean
  loading?: boolean
  iconStyle?: React.CSSProperties
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
    <Icon
      height="1.25em"
      icon={finalIcon}
      style={{
        flexShrink: 0,
        ...iconStyle
      }}
      width="1.25em"
    />
  )
}

export default memo(ButtonIcon)
