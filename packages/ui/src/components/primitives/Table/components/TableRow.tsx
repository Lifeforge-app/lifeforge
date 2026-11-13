import { clsx } from 'clsx'
import { type ComponentPropsWithRef, useContext } from 'react'

import { usePersonalization } from '@/providers/PersonalizationProvider'
import type { ColorValue, ThemeConditionProp } from '@/system'

import { bodyRowStripe, headerRowBorder } from '../Table.css'
import { TableSectionContext } from '../contexts'
import { resolveTableColorStyles } from '../utils'

export type TableRowProps = Omit<ComponentPropsWithRef<'tr'>, 'color'> & {
  bg?: ThemeConditionProp<ColorValue>
  color?: ThemeConditionProp<ColorValue>
}

export function TableRow({
  bg,
  color,
  className,
  style,
  ...rest
}: TableRowProps) {
  const { getMostReadableColor } = usePersonalization()
  const section = useContext(TableSectionContext)

  const autoColor =
    bg !== undefined && color === undefined ? getMostReadableColor() : undefined

  const colorStyles = resolveTableColorStyles(
    bg,
    autoColor === undefined ? color : undefined
  )

  return (
    <tr
      className={clsx(
        section === 'body' && bg === undefined && bodyRowStripe,
        section === 'header' && headerRowBorder,
        colorStyles.className,
        className
      )}
      style={{
        ...colorStyles.style,
        ...(autoColor === undefined ? {} : { color: autoColor }),
        ...style
      }}
      {...rest}
    />
  )
}
