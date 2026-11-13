import { clsx } from 'clsx'
import type { ComponentPropsWithRef } from 'react'

import type { ColorValue, ThemeConditionProp } from '@/system'

import { headerDefaultColor } from '../Table.css'
import { TableSectionContext } from '../contexts'
import { resolveTableColorStyles } from '../utils'

export type TableHeaderProps = Omit<ComponentPropsWithRef<'thead'>, 'color'> & {
  bg?: ThemeConditionProp<ColorValue>
  color?: ThemeConditionProp<ColorValue>
}

export function TableHeader({
  bg,
  color,
  className,
  style,
  ...rest
}: TableHeaderProps) {
  const colorStyles = resolveTableColorStyles(bg, color)

  return (
    <TableSectionContext value="header">
      <thead
        className={clsx(
          color === undefined && headerDefaultColor,
          colorStyles.className,
          className
        )}
        style={{ ...colorStyles.style, ...style }}
        {...rest}
      />
    </TableSectionContext>
  )
}
