import { clsx } from 'clsx'

import { Box, type BoxProps } from '../Box'
import * as styles from './Prose.css'

export function Prose({
  className,
  children,
  ...rest
}: BoxProps<'div'>) {
  return (
    <Box {...rest} className={clsx(styles.root, className)} >
      {children}
    </Box>
  )
}
