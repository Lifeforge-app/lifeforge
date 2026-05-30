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
  normalizeGridTrack,
  normalizeResponsiveProp,
  resolveCommonSprinkleProps,
  resolveStyles
} from '@/system'
import { shadowClass } from '@/system/vars.css'

import { Slot } from '../Slot'
import { gridBase, gridSprinkles } from './Grid.css'

type AlignValue = 'stretch' | 'center' | 'start' | 'end' | 'baseline'

type JustifyValue = 'start' | 'center' | 'end' | 'between'

type FlowValue = 'row' | 'column' | 'dense' | 'row dense' | 'column dense'

type GridDisplayValue = 'none' | 'grid' | 'inline-grid'

interface GridOwnProps<T extends ElementType = 'div'>
  extends TokenizedCommonProps, ArbitraryProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<GridDisplayValue>
  templateRows?: ResponsiveProp<number | string, string>
  templateCols?: ResponsiveProp<number | string, string>
  flow?: ResponsiveProp<FlowValue>
  align?: ResponsiveProp<AlignValue>
  justify?: ResponsiveProp<JustifyValue>
  gap?: ResponsiveProp<SpaceToken>
  gapX?: ResponsiveProp<SpaceToken>
  gapY?: ResponsiveProp<SpaceToken>
  bg?: ThemeConditionProp<ColorValue>
  shadow?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type GridProps<T extends ElementType = 'div'> = GridOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof GridOwnProps<T>>

const justifyMap = {
  start: 'start',
  center: 'center',
  end: 'end',
  between: 'space-between'
} as const satisfies Record<JustifyValue, string>

export function Grid<T extends ElementType = 'div'>({
  as,
  asChild = false,
  ref,
  display = 'grid',
  templateCols,
  templateRows,
  flow,
  gap,
  gapX,
  gapY,
  bg,
  r,
  rtl,
  rtr,
  rbl,
  rbr,
  shadow,
  align,
  justify,
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
}: GridProps<T>) {
  const Component = asChild ? Slot : (as ?? 'div')

  const styles = resolveStyles<
    typeof gridSprinkles,
    {
      gridTemplateColumns: Pick<GridOwnProps, 'templateCols'>['templateCols']
      gridTemplateRows: Pick<GridOwnProps, 'templateCols'>['templateCols']
    }
  >({
    sprinkles: gridSprinkles,
    sprinkleProps: {
      display: normalizeResponsiveProp(display),
      gap: normalizeResponsiveProp(gap),
      rowGap: normalizeResponsiveProp(gapY),
      columnGap: normalizeResponsiveProp(gapX),
      alignItems: normalizeResponsiveProp(align),
      justifyContent: normalizeResponsiveProp(justify, v => justifyMap[v]),
      gridAutoFlow: normalizeResponsiveProp(flow),
      ...resolveCommonSprinkleProps(
        { p, px, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml },
        {
          position,
          overflow,
          overflowX,
          overflowY
        },
        {
          r,
          rtl,
          rtr,
          rbl,
          rbr
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
    componentArbitraryProps: {
      gridTemplateColumns: normalizeResponsiveProp(
        templateCols,
        normalizeGridTrack
      ),
      gridTemplateRows: normalizeResponsiveProp(
        templateRows,
        normalizeGridTrack
      )
    },
    colorProps: { bg },
    className: clsx(gridBase(), className, shadow && shadowClass),
    style
  })

  return (
    <Component ref={ref as Ref<never>} {...styles} {...rest}>
      {children}
    </Component>
  )
}
