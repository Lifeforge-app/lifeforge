import { type CSSProperties, type ReactNode, type Ref } from 'react'

import { COLORS, type ColorToken, withOpacity } from '@/system'

import { Slot } from '../Slot'
import { type DivideAxis, divideVariants } from './WithDivide.css'

interface WithDivideProps {
  ref?: Ref<HTMLElement>
  axis?: DivideAxis
  color?: ColorToken
  darkColor?: ColorToken
  children?: ReactNode
}

export function WithDivide({
  ref,
  axis = 'y',
  color = 'bg-200',
  darkColor: darkColorToken = 'bg-700',
  children
}: WithDivideProps) {
  return (
    <Slot
      ref={ref}
      className={divideVariants[axis]}
      style={
        {
          '--divide-color': COLORS[color],
          '--divide-dark-color': withOpacity(COLORS[darkColorToken], 0.5)
        } as CSSProperties
      }
    >
      {children}
    </Slot>
  )
}
