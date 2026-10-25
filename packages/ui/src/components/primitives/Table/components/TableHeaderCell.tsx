import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

import { cellAlign, cellBase, cellNowrap, headerCell } from '../Table.css'
import type { TableCellOwnProps } from '../types'
import { resolveTableColorStyles } from '../utils'

export type TableHeaderCellProps = Omit<
  ComponentPropsWithRef<'th'>,
  'align' | 'color'
> &
  TableCellOwnProps

export function TableHeaderCell({
  align = 'center',
  nowrap = true,
  scope = 'col',
  bg,
  color,
  width,
  minWidth,
  maxWidth,
  className,
  style,
  ...rest
}: TableHeaderCellProps) {
  const colorStyles = resolveTableColorStyles(bg, color)

  return (
    <th
      className={clsx(
        cellBase,
        headerCell,
        cellAlign({ align }),
        cellNowrap({ nowrap }),
        colorStyles.className,
        className
      )}
      scope={scope}
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
