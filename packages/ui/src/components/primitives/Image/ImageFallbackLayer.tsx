import type { ReactNode } from 'react'

import { Icon } from '../Icon'

export function ImageFallbackLayer({
  fallback
}: {
  fallback: ReactNode | string
}) {
  if (typeof fallback === 'string') {
    return (
      <Icon
        color={{ base: 'bg-300', dark: 'bg-700' }}
        icon={fallback}
        size="clamp(0.75em, 30%, 3.5em)"
      />
    )
  }

  return <>{fallback}</>
}
