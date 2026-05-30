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
  type SpaceToken,
  type ThemeConditionProp,
  type TokenizedCommonProps,
  normalizeGridSpan,
  normalizeResponsiveProp,
  resolveCommonSprinkleProps,
  resolveStyles,
  shadowClass
} from '@/system'

import { Slot } from '../Slot'
import { flexBase, flexSprinkles } from './Flex.css'

type FlexDisplayValue = 'none' | 'flex' | 'inline-flex'

type DirectionValue = 'row' | 'column' | 'row-reverse' | 'column-reverse'

type AlignValue = 'stretch' | 'center' | 'start' | 'end' | 'baseline'

type JustifyValue = 'start' | 'center' | 'between' | 'around' | 'evenly' | 'end'

type WrapValue = 'nowrap' | 'wrap' | 'wrap-reverse'

interface FlexOwnProps<T extends ElementType = 'div'>
  extends TokenizedCommonProps, ArbitraryProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<FlexDisplayValue>
  centered?: boolean
  direction?: ResponsiveProp<DirectionValue>
  gap?: ResponsiveProp<SpaceToken>
  gapX?: ResponsiveProp<SpaceToken>
  gapY?: ResponsiveProp<SpaceToken>
  align?: ResponsiveProp<AlignValue>
  justify?: ResponsiveProp<JustifyValue>
  wrap?: ResponsiveProp<WrapValue>
  bg?: ThemeConditionProp<ColorValue>
  shadow?: boolean
  className?: string
  style?: CSSProperties
  sus?: string
  children?: ReactNode
}

export type FlexProps<T extends ElementType = 'div'> = FlexOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof FlexOwnProps<T>>

const alignMap = {
  stretch: 'stretch',
  center: 'center',
  start: 'flex-start',
  end: 'flex-end',
  baseline: 'baseline'
} as const satisfies Record<AlignValue, string>

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  end: 'flex-end'
} as const satisfies Record<JustifyValue, string>

export function Flex<T extends ElementType = 'div'>({
  as,
  asChild = false,
  ref,
  display = 'flex',
  centered,
  direction,
  gap,
  gapX,
  gapY,
  align: alignProp,
  justify: justifyProp,
  wrap,
  bg,
  r,
  rtl,
  rtr,
  rbl,
  rbr,
  shadow,
  // Layout props (CSS string - responsive)
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  aspectRatio,
  zIndex,
  position,
  inset,
  top,
  right,
  bottom,
  left,
  overflow,
  overflowX,
  overflowY,
  flex,
  flexBasis,
  flexGrow,
  flexShrink,
  gridArea,
  gridColumnSpan,
  gridRowSpan,
  // Padding
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  // Margin
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  className,
  style,
  children,
  ...rest
}: FlexProps<T>) {
  const align = centered ? 'center' : alignProp

  const justify = centered ? 'center' : justifyProp

  const Component = asChild ? Slot : (as ?? 'div')

  const final = resolveStyles({
    sprinkles: flexSprinkles,
    sprinkleProps: {
      display: normalizeResponsiveProp(display),
      flexDirection: normalizeResponsiveProp(direction),
      gap: normalizeResponsiveProp(gap),
      rowGap: normalizeResponsiveProp(gapY),
      columnGap: normalizeResponsiveProp(gapX),
      alignItems: normalizeResponsiveProp(align, v => alignMap[v]),
      justifyContent: normalizeResponsiveProp(justify, v => justifyMap[v]),
      flexWrap: normalizeResponsiveProp(wrap),
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
      gridColumnSpan: normalizeResponsiveProp(
        gridColumnSpan,
        normalizeGridSpan
      ),
      gridRowSpan: normalizeResponsiveProp(gridRowSpan, normalizeGridSpan)
    },
    colorProps: { bg },
    className: clsx(flexBase(), className, shadow && shadowClass),
    style
  })

  return (
    <Component ref={ref as Ref<never>} {...final} {...rest}>
      {children}
    </Component>
  )
}
