import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import {
  type ArbitraryProps,
  type ColorToken,
  type RadiusToken,
  type ResponsiveProp,
  type TokenizedCommonProps,
  normalizeResponsiveProp,
  resolveCommonSprinkleProps,
  resolveStyles
} from '@/system'
import { normalizeGridSpan } from '@/system/grid-utils'
import type { ThemeConditionProp } from '@/system/themes'
import { shadowClass } from '@/system/vars.css'

import { Slot } from '../Slot'
import { type BoxSprinkles, boxBase, boxSprinkles } from './Box.css'

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

interface BoxOwnProps<T extends ElementType = 'div'>
  extends TokenizedCommonProps, ArbitraryProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<DisplayValue>
  bg?: ThemeConditionProp<ColorToken>
  rounded?: ResponsiveProp<RadiusToken>
  shadow?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type BoxProps<T extends ElementType = 'div'> = BoxOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof BoxOwnProps<T>>

export function Box<T extends ElementType = 'div'>({
  as,
  asChild = false,
  ref,
  // Padding
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  // Margin
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  // Layout props (CSS string - now responsive!)
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  zIndex,
  inset,
  top,
  right,
  bottom,
  left,
  flex,
  flexBasis,
  flexGrow,
  flexShrink,
  gridArea,
  gridColumnSpan,
  gridRowSpan,
  // Sprinkle props
  display,
  position,
  overflow,
  overflowX,
  overflowY,
  bg,
  rounded,
  shadow,
  // Standard props
  className,
  style,
  children,
  ...rest
}: BoxProps<T>) {
  const Component = asChild ? Slot : (as ?? 'div')

  const styles = resolveStyles({
    sprinkles: boxSprinkles,
    sprinkleProps: {
      display: normalizeResponsiveProp(display) as BoxSprinkles['display'],
      backgroundColor: bg as BoxSprinkles['backgroundColor'],
      borderRadius: normalizeResponsiveProp(
        rounded
      ) as BoxSprinkles['borderRadius'],
      ...resolveCommonSprinkleProps(
        { p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml },
        {
          position,
          overflow,
          overflowX,
          overflowY
        }
      )
    },
    arbitraryProps: {
      width,
      minWidth,
      maxWidth,
      height,
      minHeight,
      maxHeight,
      zIndex,
      inset,
      top,
      right,
      bottom,
      left,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      gridArea,
      gridColumnSpan: normalizeResponsiveProp(
        gridColumnSpan,
        normalizeGridSpan
      ),
      gridRowSpan: normalizeResponsiveProp(gridRowSpan, normalizeGridSpan)
    },
    className: clsx(boxBase(), className, shadow && shadowClass),
    style
  })

  return (
    <Component ref={ref as Ref<never>} {...styles} {...rest}>
      {children}
    </Component>
  )
}
