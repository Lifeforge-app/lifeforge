import { clsx } from 'clsx'
import { type CSSProperties, type ReactNode } from 'react'

import * as styles from './Prose.css'

export function Prose({
  className,
  style,
  children
}: {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  return (
    <div className={clsx(styles.root, className)} style={style}>
      {children}
    </div>
  )
}
