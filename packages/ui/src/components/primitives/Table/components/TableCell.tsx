import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

import { cellAlign, cellBase, cellNowrap, totalCell } from '../Table.css'
import type { TableCellOwnProps, TableCellVariant } from '../types'
import { resolveTableColorStyles } from '../utils'

export type TableCellProps = Omit<
  ComponentPropsWithRef<'td'>,
  'align' | 'color' | 'width'
> &
  TableCellOwnProps & {
    variant?: TableCellVariant
  }

export function TableCell({
  align = 'left',
  nowrap = false,
  variant = 'default',
  bg,
  color,
  width,
  minWidth,
  maxWidth,
  className,
  style,
  ...rest
}: TableCellProps) {
  const colorStyles = resolveTableColorStyles(bg, color)

  return (
    <td
      className={clsx(
        cellBase,
        cellAlign({ align }),
        cellNowrap({ nowrap }),
        variant === 'total' && totalCell,
        colorStyles.className,
        className
      )}
      style={{
        width,
        minWidth,
        maxWidth,
        ...colorStyles.style,
        ...style
      }}
      {...rest}
    />
  )
}
