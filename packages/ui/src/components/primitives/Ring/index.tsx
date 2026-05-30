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
  type ColorValue,
  type ResponsiveProp,
  type ThemeConditionProp,
  type TokenizedCommonProps,
  normalizeResponsiveProp,
  resolveCommonSprinkleProps,
  resolveStyles,
  shadowClass
} from '@/system'
import { normalizeGridSpan } from '@/system/grid-utils'

import { Slot } from '../Slot'
import { type RingSprinkles, ringBase, ringSprinkles } from './Ring.css'

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'
type RingProps<T extends ElementType = 'div'> = TokenizedCommonProps &
  ArbitraryProps & {
    as?: T
    asChild?: boolean
    ref?: Ref<HTMLElement>
    display?: ResponsiveProp<DisplayValue>
    ringWidth?: ResponsiveProp<string>
    ringColor?: ThemeConditionProp<ColorValue>
    ringOffsetWidth?: ResponsiveProp<string>
    shadow?: boolean
    className?: string
    style?: CSSProperties
    children?: ReactNode
  } & Omit<
    ComponentPropsWithRef<T>,
    | 'as'
    | 'asChild'
    | 'ref'
    | 'display'
    | 'ringWidth'
    | 'ringColor'
    | 'ringOffsetWidth'
    | 'shadow'
    | 'className'
    | 'style'
    | 'children'
  >

export function Ring<T extends ElementType = 'div'>({
  as,
  asChild = false,
  ref,
  display,
  ringWidth = '3px',
  ringColor = 'custom-500',
  ringOffsetWidth = '0px',
  shadow = false,
  p,
  pb,
  pl,
  pr,
  pt,
  px,
  py,
  m,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  r,
  rtl,
  rtr,
  rbl,
  rbr,
  position,
  overflow,
  overflowX,
  overflowY,
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  aspectRatio,
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
  className,
  style,
  children,
  ...rest
}: RingProps<T>) {
  const Component = asChild ? Slot : (as ?? 'div')

  const styles = resolveStyles({
    sprinkles: ringSprinkles,
    sprinkleProps: {
      display: normalizeResponsiveProp(display) as RingSprinkles['display'],
      ...resolveCommonSprinkleProps(
        { p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml },
        {
          position,
          overflow,
          overflowX,
          overflowY
        },
        { r, rtl, rtr, rbl, rbr }
      )
    },
    arbitraryProps: {
      bottom,
      flex,
      flexBasis,
      flexGrow,
      flexShrink,
      gridArea,
      height,
      inset,
      left,
      maxHeight,
      maxWidth,
      minHeight,
      minWidth,
      right,
      top,
      width,
      zIndex,
      aspectRatio,
      gridColumnSpan: normalizeResponsiveProp(
        gridColumnSpan,
        normalizeGridSpan
      ),
      gridRowSpan: normalizeResponsiveProp(gridRowSpan, normalizeGridSpan)
    },
    componentArbitraryProps: {
      ringWidth: normalizeResponsiveProp(ringWidth),
      ringOffsetWidth: normalizeResponsiveProp(ringOffsetWidth)
    },
    colorProps: { ringColor },
    className: clsx(ringBase(), shadow && shadowClass, className),
    style
  })

  return (
    <Component ref={ref as Ref<never>} {...styles} {...rest}>
      {children}
    </Component>
  )
}
