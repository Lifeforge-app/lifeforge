import clsx from 'clsx'
import { type CSSProperties, type ReactNode, type Ref } from 'react'

import {
  type ColorValue,
  type ThemeConditionProp,
  colorWithOpacity,
  resolveColorProp
} from '@/system'

import { Slot } from '../Slot'
import { type DivideAxis, divideVariants } from './WithDivide.css'

interface WithDivideProps {
  ref?: Ref<HTMLElement>
  axis?: DivideAxis
  color?: ThemeConditionProp<ColorValue>
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

export function WithDivide({
  ref,
  axis = 'y',
  color = { base: 'bg-200', dark: colorWithOpacity('bg-700', '50%') },
  children,
  className,
  style
}: WithDivideProps) {
  const resolvedColor = resolveColorProp('divideColor', color)

  return (
    <Slot
      ref={ref}
      className={clsx(divideVariants[axis], resolvedColor.className, className)}
      style={{ ...resolvedColor.style, ...style }}
    >
      {children}
    </Slot>
  )
}
