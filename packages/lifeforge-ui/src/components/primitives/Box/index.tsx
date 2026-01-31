import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../../../system'
import { Slot } from '../Slot'
import { getResponsiveLayoutStyles } from '../propDefs'
import { type LayoutProps, type MarginProps } from '../types'
import { type BoxSprinkles, boxBase, boxSprinkles } from './box.css'

type BgColor =
  | 'transparent'
  | 'bg-50'
  | 'bg-100'
  | 'bg-200'
  | 'bg-300'
  | 'bg-400'
  | 'bg-500'
  | 'bg-600'
  | 'bg-700'
  | 'bg-800'
  | 'bg-900'
  | 'bg-950'
  | 'custom-50'
  | 'custom-100'
  | 'custom-200'
  | 'custom-300'
  | 'custom-400'
  | 'custom-500'
  | 'custom-600'
  | 'custom-700'
  | 'custom-800'
  | 'custom-900'

type RadiusValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

const DEFAULT_ELEMENT = 'div' as const

interface BoxOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<DisplayValue>
  bg?: ResponsiveProp<BgColor>
  rounded?: ResponsiveProp<RadiusValue>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type BoxProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  BoxOwnProps<T> & Omit<ComponentPropsWithRef<T>, keyof BoxOwnProps<T>>

export function Box<T extends ElementType = typeof DEFAULT_ELEMENT>({
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
  // Sprinkle props
  display,
  position,
  overflow,
  overflowX,
  overflowY,
  bg,
  rounded,
  // Standard props
  className,
  style,
  children,
  ...rest
}: BoxProps<T>) {
  // Build sprinkles className for tokenized props
  const sprinklesClassName = boxSprinkles({
    display: normalizeResponsiveProp(display) as BoxSprinkles['display'],
    position: normalizeResponsiveProp(position) as BoxSprinkles['position'],
    overflow: normalizeResponsiveProp(
      overflow ?? overflowX ?? overflowY
    ) as BoxSprinkles['overflow'],
    padding: normalizeResponsiveProp(p) as BoxSprinkles['padding'],
    paddingTop: normalizeResponsiveProp(pt ?? py) as BoxSprinkles['paddingTop'],
    paddingBottom: normalizeResponsiveProp(
      pb ?? py
    ) as BoxSprinkles['paddingBottom'],
    paddingLeft: normalizeResponsiveProp(
      pl ?? px
    ) as BoxSprinkles['paddingLeft'],
    paddingRight: normalizeResponsiveProp(
      pr ?? px
    ) as BoxSprinkles['paddingRight'],
    margin: normalizeResponsiveProp(m) as BoxSprinkles['margin'],
    marginTop: normalizeResponsiveProp(mt ?? my) as BoxSprinkles['marginTop'],
    marginBottom: normalizeResponsiveProp(
      mb ?? my
    ) as BoxSprinkles['marginBottom'],
    marginLeft: normalizeResponsiveProp(ml ?? mx) as BoxSprinkles['marginLeft'],
    marginRight: normalizeResponsiveProp(
      mr ?? mx
    ) as BoxSprinkles['marginRight'],
    backgroundColor: normalizeResponsiveProp(
      bg
    ) as BoxSprinkles['backgroundColor'],
    borderRadius: normalizeResponsiveProp(
      rounded
    ) as BoxSprinkles['borderRadius']
  })

  // Build responsive styles for CSS string props (now with breakpoint support!)
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
