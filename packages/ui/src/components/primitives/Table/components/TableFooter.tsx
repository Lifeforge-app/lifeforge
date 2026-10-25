import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

import type { ColorValue, ThemeConditionProp } from '@/system'

import { footerBorder } from '../Table.css'
import { TableSectionContext } from '../contexts'
import { resolveTableColorStyles } from '../utils'

export type TableFooterProps = Omit<ComponentPropsWithRef<'tfoot'>, 'color'> & {
  bg?: ThemeConditionProp<ColorValue>
  color?: ThemeConditionProp<ColorValue>
}

export function TableFooter({
  bg,
  color,
  className,
  style,
  ...rest
}: TableFooterProps) {
  const colorStyles = resolveTableColorStyles(bg, color)

  return (
    <TableSectionContext value="footer">
      <tfoot
        className={clsx(footerBorder, colorStyles.className, className)}
        style={{ ...colorStyles.style, ...style }}
        {...rest}
      />
    </TableSectionContext>
  )
}
