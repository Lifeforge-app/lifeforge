import clsx from 'clsx'
import { type HTMLAttributes, type ReactNode, type Ref } from 'react'

import {
  type ColorValue,
  type ThemeConditionProp,
  resolveColorProp
} from '@/system'

import { Slot } from '../Slot'
import { type DivideAxis, divideVariants } from './WithDivide.css'

interface WithDivideProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  ref?: Ref<HTMLElement>
  axis?: DivideAxis
  color?: ThemeConditionProp<ColorValue>
  children?: ReactNode
}

export function WithDivide({
  ref,
  axis = 'y',
  color = 'bg-200',
  children,
  ...rest
}: WithDivideProps) {
  const resolvedColor = resolveColorProp('divideColor', color)

  return (
    <Slot
      ref={ref}
      className={clsx(divideVariants[axis], resolvedColor.className)}
      style={resolvedColor.style}
      {...rest}
    >
      {children}
    </Slot>
  )
}
