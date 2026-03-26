import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import {
  type LayoutProps,
  type MarginProps,
  type ResponsiveProp,
  getResponsiveLayoutStyles,
  normalizeResponsiveProp,
  resolveCommonSprinkleProps
} from '@/system'

import { type BoxSprinkles, boxBase, boxSprinkles } from '../Box/box.css'
import { Slot } from '../Slot'

type SectionSize = '1' | '2' | '3' | '4'

const DEFAULT_ELEMENT = 'section' as const

interface SectionOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  size?: ResponsiveProp<SectionSize>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type SectionProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  SectionOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof SectionOwnProps<T>>

// Vertical padding based on size
const sizeToPaddingY: Record<SectionSize, BoxSprinkles['paddingTop']> = {
  '1': 'md',
  '2': 'lg',
  '3': 'xl',
  '4': '2xl'
}

export function Section<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  size = '2',
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
  // Padding (can override size)
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
}: SectionProps<T>) {
  // Size-based padding, can be overridden by explicit py/pt/pb
  const resolvedPy =
    py ?? (typeof size === 'object' ? undefined : sizeToPaddingY[size])

  const resolvedPt =
    pt ??
    (typeof size === 'object'
      ? normalizeResponsiveProp(size, v => sizeToPaddingY[v])
      : undefined)

  const resolvedPb =
    pb ??
    (typeof size === 'object'
      ? normalizeResponsiveProp(size, v => sizeToPaddingY[v])
      : undefined)

  const sprinklesClassName = boxSprinkles({
    ...resolveCommonSprinkleProps({
      m,
      mx,
      my,
      mt,
      mr,
      mb,
      ml,
      position,
      overflow,
      overflowX,
      overflowY
    }),
    // Section uses size-driven padding; explicit props override
    paddingTop: normalizeResponsiveProp(
      resolvedPt ?? resolvedPy
    ) as BoxSprinkles['paddingTop'],
    paddingBottom: normalizeResponsiveProp(
      resolvedPb ?? resolvedPy
    ) as BoxSprinkles['paddingBottom'],
    paddingLeft: normalizeResponsiveProp(
      pl ?? px ?? p
    ) as BoxSprinkles['paddingLeft'],
    paddingRight: normalizeResponsiveProp(
      pr ?? px ?? p
    ) as BoxSprinkles['paddingRight']
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
        boxBase(),
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
