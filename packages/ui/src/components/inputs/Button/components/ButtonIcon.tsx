import { memo, useMemo } from 'react'

import { Box, Icon } from '@/components/primitives'

function _ButtonIcon({
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
    <Box
      asChild
      flexShrink="0"
      style={{
        ...iconStyle
      }}
    >
      <Icon icon={finalIcon} />
    </Box>
  )
}

export const ButtonIcon = memo(_ButtonIcon)
