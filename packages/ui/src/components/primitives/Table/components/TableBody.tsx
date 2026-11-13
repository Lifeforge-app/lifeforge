import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

import type { ColorValue, ThemeConditionProp } from '@/system'

import { TableSectionContext } from '../contexts'
import { resolveTableColorStyles } from '../utils'

export type TableBodyProps = Omit<ComponentPropsWithRef<'tbody'>, 'color'> & {
  bg?: ThemeConditionProp<ColorValue>
  color?: ThemeConditionProp<ColorValue>
}

export function TableBody({
  bg,
  color,
  className,
  style,
  ...rest
}: TableBodyProps) {
  const colorStyles = resolveTableColorStyles(bg, color)

  return (
    <TableSectionContext value="body">
      <tbody
        className={clsx(colorStyles.className, className)}
        style={{ ...colorStyles.style, ...style }}
        {...rest}
      />
    </TableSectionContext>
  )
}
