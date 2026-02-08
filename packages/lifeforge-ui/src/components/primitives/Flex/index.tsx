import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../../../system'
import type { SpaceToken } from '../../../system'
import { Slot } from '../Slot'
import { getResponsiveLayoutStyles } from '../propDefs'
import {
  type FlexDisplayValue,
  type LayoutProps,
  type MarginProps
} from '../types'
import { type FlexSprinkles, flexBase, flexSprinkles } from './flex.css'

type DirectionValue = 'row' | 'column' | 'row-reverse' | 'column-reverse'

type AlignValue = 'stretch' | 'center' | 'start' | 'end'

type JustifyValue = 'start' | 'center' | 'between' | 'around' | 'evenly' | 'end'

type WrapValue = 'nowrap' | 'wrap' | 'wrap-reverse'

const DEFAULT_ELEMENT = 'div' as const

interface FlexOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<FlexDisplayValue>
  direction?: ResponsiveProp<DirectionValue>
  gap?: ResponsiveProp<SpaceToken>
  gapX?: ResponsiveProp<SpaceToken>
  gapY?: ResponsiveProp<SpaceToken>
  align?: ResponsiveProp<AlignValue>
  justify?: ResponsiveProp<JustifyValue>
  wrap?: ResponsiveProp<WrapValue>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type FlexProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  FlexOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof FlexOwnProps<T>>

const alignMap: Record<AlignValue, FlexSprinkles['alignItems']> = {
  stretch: 'stretch',
  center: 'center',
  start: 'flex-start',
  end: 'flex-end'
}

const justifyMap: Record<JustifyValue, FlexSprinkles['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
  end: 'flex-end'
}

export function Flex<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  display = 'flex',
  direction,
  gap,
  gapX,
  gapY,
  align,
  justify,
  wrap,
  // Layout props (CSS string - responsive)
  width,
  minWidth,
  maxWidth,
  height,
  minHeight,
  maxHeight,
  position,
  inset,
  top,
  right,
  bottom,
  left,
  overflow,
  overflowX,
  overflowY,
  flexBasis,
  flexGrow,
  flexShrink,
  gridArea,
  gridColumn,
  gridColumnStart,
  gridColumnEnd,
  gridRow,
  gridRowStart,
  gridRowEnd,
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
  const sprinklesClassName = flexSprinkles({
    display: normalizeResponsiveProp(display) as FlexSprinkles['display'],
    flexDirection: normalizeResponsiveProp(
      direction
    ) as FlexSprinkles['flexDirection'],
    gap: normalizeResponsiveProp(gap) as FlexSprinkles['gap'],
    rowGap: normalizeResponsiveProp(gapY) as FlexSprinkles['rowGap'],
    columnGap: normalizeResponsiveProp(gapX) as FlexSprinkles['columnGap'],
    alignItems: normalizeResponsiveProp(
      align,
      v => alignMap[v]
    ) as FlexSprinkles['alignItems'],
    justifyContent: normalizeResponsiveProp(
      justify,
      v => justifyMap[v]
    ) as FlexSprinkles['justifyContent'],
    flexWrap: normalizeResponsiveProp(wrap) as FlexSprinkles['flexWrap']
  })

  // Build responsive styles for CSS string props
  const responsiveStyles = getResponsiveLayoutStyles({
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    inset,
    top,
    right,
    bottom,
    left,
    flexBasis,
    flexGrow,
    flexShrink,
    gridArea,
    gridColumn,
    gridColumnStart,
    gridColumnEnd,
    gridRow,
    gridRowStart,
    gridRowEnd
  })

  const mergedStyle =
    Object.keys(responsiveStyles.style).length > 0
      ? { ...responsiveStyles.style, ...style }
      : style

  const Component = asChild ? Slot : (as ?? DEFAULT_ELEMENT)

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(
        flexBase(),
        sprinklesClassName,
        responsiveStyles.className,
        className
      )}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}
