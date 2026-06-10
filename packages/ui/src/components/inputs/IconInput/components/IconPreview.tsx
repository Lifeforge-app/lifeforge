import { loadIcon } from '@iconify/react'
import { useEffect, useState } from 'react'

import type { InputVariant } from '@/components/inputs/shared/types'
import { Box, Icon } from '@/components/primitives'

import * as styles from '../IconInput.css'

export function IconPreview({
  value,
  variant
}: {
  value: string
  variant: InputVariant
}) {
  const [iconExists, setIconExists] = useState(false)
  useEffect(() => {
    let active = true

    if (!value) {
      setIconExists(false)

      return
    }
    loadIcon(value)
      .then(() => {
        if (active) setIconExists(true)
      })
      .catch(() => {
        if (active) setIconExists(false)
      })

    return () => {
      active = false
    }
  }, [value])

  return (
    <Box
      asChild
      flexShrink="0"
      style={{
        height: variant === 'plain' ? '1.5em' : '1em',
        width: variant === 'plain' ? '1.5em' : '1em'
      }}
    >
      <span
        className={
          !value && variant === 'classic' ? styles.iconHidden : undefined
        }
      >
        <Icon
          icon={value && iconExists ? value : 'tabler:question-mark'}
          size={variant === 'plain' ? '1.5em' : '1em'}
        />
      </span>
    </Box>
  )
}
