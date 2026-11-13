import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

import { caption } from '../Table.css'

export type TableCaptionProps = ComponentPropsWithRef<'caption'> & {
  side?: 'top' | 'bottom'
}

export function TableCaption({
  side = 'bottom',
  className,
  style,
  ...rest
}: TableCaptionProps) {
  return (
    <caption
      className={clsx(caption, className)}
      style={{ captionSide: side, ...style }}
      {...rest}
    />
  )
}
