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
import { type LayoutProps, type MarginProps } from '../types'
import { type GridSprinkles, gridBase, gridSprinkles } from './grid.css'

type AlignValue = 'stretch' | 'center' | 'start' | 'end' | 'baseline'

type JustifyValue = 'start' | 'center' | 'end' | 'between'

type FlowValue = 'row' | 'column' | 'dense' | 'row dense' | 'column dense'

type GridDisplayValue = 'none' | 'grid' | 'inline-grid'

const DEFAULT_ELEMENT = 'div' as const

interface GridOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<GridDisplayValue>
  columns?: ResponsiveProp<string>
  rows?: ResponsiveProp<string>
  flow?: ResponsiveProp<FlowValue>
  align?: ResponsiveProp<AlignValue>
  justify?: ResponsiveProp<JustifyValue>
  gap?: ResponsiveProp<SpaceToken>
  gapX?: ResponsiveProp<SpaceToken>
  gapY?: ResponsiveProp<SpaceToken>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type GridProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  GridOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof GridOwnProps<T>>

const justifyMap: Record<JustifyValue, GridSprinkles['justifyContent']> = {
  start: 'start',
  center: 'center',
  end: 'end',
  between: 'space-between'
}

export function Grid<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  display = 'grid',
  columns,
  rows,
  flow,
  gap,
  gapX,
  gapY,
  align,
  justify,
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
}: GridProps<T>) {
  const sprinklesClassName = gridSprinkles({
    display: normalizeResponsiveProp(display) as GridSprinkles['display'],
    gap: normalizeResponsiveProp(gap) as GridSprinkles['gap'],
    rowGap: normalizeResponsiveProp(gapY) as GridSprinkles['rowGap'],
    columnGap: normalizeResponsiveProp(gapX) as GridSprinkles['columnGap'],
    alignItems: normalizeResponsiveProp(align) as GridSprinkles['alignItems'],
    justifyContent: normalizeResponsiveProp(
      justify,
      v => justifyMap[v]
    ) as GridSprinkles['justifyContent'],
    gridAutoFlow: normalizeResponsiveProp(flow) as GridSprinkles['gridAutoFlow']
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
    gridRowEnd,
    columns,
    rows
  })

  const mergedStyle = { ...responsiveStyles.style, ...style }

  const Component = asChild ? Slot : (as ?? DEFAULT_ELEMENT)

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(
        gridBase(),
        sprinklesClassName,
        responsiveStyles.className,
        className
      )}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      {...rest}
    >
      {children}
    </Component>
  )
}
