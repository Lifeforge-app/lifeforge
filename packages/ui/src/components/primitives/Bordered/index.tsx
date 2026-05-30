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
  resolveStyles
} from '@/system'
import { normalizeGridSpan } from '@/system/grid-utils'
import { shadowClass } from '@/system/vars.css'

import { Slot } from '../Slot'
import {
  type BorderedSprinkles,
  borderedBase,
  borderedSprinkles
} from './Bordered.css'

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

export type BorderSide = 'all' | 'top' | 'right' | 'bottom' | 'left' | 'x' | 'y'

export type BorderStyleValue = 'solid' | 'dashed' | 'dotted' | 'double' | 'none'

interface BorderedOwnProps<T extends ElementType = 'div'>
  extends TokenizedCommonProps, ArbitraryProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<DisplayValue>
  bg?: ThemeConditionProp<ColorValue>
  borderColor?: ThemeConditionProp<ColorValue>
  color?: ThemeConditionProp<ColorValue>
  borderStyle?: BorderStyleValue
  borderSide?: BorderSide
  borderWidth?: string
  shadow?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type BorderedProps<T extends ElementType = 'div'> = BorderedOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof BorderedOwnProps<T>>

export function computeBorderStyles(
  side: BorderSide,
  width: string,
  style: BorderStyleValue
): CSSProperties {
  if (side === 'all') {
    return { borderStyle: style, borderWidth: width }
  }

  const props: CSSProperties = { borderStyle: 'none' }

  if (side === 'top' || side === 'y') {
    props.borderTopStyle = style
    props.borderTopWidth = width
  }

  if (side === 'right' || side === 'x') {
    props.borderRightStyle = style
    props.borderRightWidth = width
  }

  if (side === 'bottom' || side === 'y') {
    props.borderBottomStyle = style
    props.borderBottomWidth = width
  }

  if (side === 'left' || side === 'x') {
    props.borderLeftStyle = style
    props.borderLeftWidth = width
  }

  return props
}

export function Bordered<T extends ElementType = 'div'>({
  as,
  asChild = false,
  ref,
  display,
  // Border props
  borderColor = { base: 'bg-300', dark: 'bg-600' },
  borderStyle = 'solid',
  borderSide = 'all',
  borderWidth = '1px',
  // Container props
  bg,
  color,
  r,
  rtl,
  rtr,
  rbl,
  rbr,
  shadow,
  // Layout props (CSS string - responsive)
  bottom,
  flex,
  flexBasis,
  flexGrow,
  flexShrink,
  gridArea,
  gridColumnSpan,
  gridRowSpan,
  height,
  inset,
  left,
  maxHeight,
  maxWidth,
  minHeight,
  minWidth,
  overflow,
  overflowX,
  overflowY,
  position,
  right,
  top,
  width,
  zIndex,
  aspectRatio,
  // Padding
  p,
  pb,
  pl,
  pr,
  pt,
  px,
  py,
  // Margin
  m,
  mb,
  ml,
  mr,
  mt,
  mx,
  my,
  className,
  style,
  children,
  ...rest
}: BorderedProps<T>) {
  const Component = asChild ? Slot : (as ?? 'div')

  const styles = resolveStyles({
    sprinkles: borderedSprinkles,
    sprinkleProps: {
      display: normalizeResponsiveProp(display) as BorderedSprinkles['display'],
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
    colorProps: { bg, borderColor, color },
    className: clsx(borderedBase(), className, shadow && shadowClass),
    style: {
      ...computeBorderStyles(borderSide, borderWidth, borderStyle),
      ...style
    }
  })

  return (
    <Component ref={ref as Ref<never>} {...styles} {...rest}>
      {children}
    </Component>
  )
}
