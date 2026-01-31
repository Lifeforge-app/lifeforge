import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import { type ResponsiveProp, normalizeResponsiveProp } from '../../../system'
import { type BoxSprinkles, boxBase, boxSprinkles } from '../Box/box.css'
import { Slot } from '../Slot'
import { getResponsiveLayoutStyles } from '../propDefs'
import { type LayoutProps, type MarginProps } from '../types'

type ContainerSize = '1' | '2' | '3' | '4'

const DEFAULT_ELEMENT = 'div' as const

interface ContainerOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  size?: ResponsiveProp<ContainerSize>
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type ContainerProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  ContainerOwnProps<T> &
    Omit<ComponentPropsWithRef<T>, keyof ContainerOwnProps<T>>

// Max-width based on size
const sizeToMaxWidth: Record<ContainerSize, string> = {
  '1': '448px',
  '2': '688px',
  '3': '880px',
  '4': '1136px'
}

export function Container<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  size = '4',
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
}: ContainerProps<T>) {
  const sprinklesClassName = boxSprinkles({
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
    position: normalizeResponsiveProp(position) as BoxSprinkles['position'],
    overflow: normalizeResponsiveProp(
      overflow ?? overflowX ?? overflowY
    ) as BoxSprinkles['overflow']
  })

  // Size-based max-width, can be overridden by explicit maxWidth
  const sizeValue = typeof size === 'object' ? size.base : size

  const maxWidthValue = typeof maxWidth === 'object' ? maxWidth.base : maxWidth

  const resolvedMaxWidth =
    maxWidthValue ?? (sizeValue ? sizeToMaxWidth[sizeValue] : undefined)

  // Build responsive styles for CSS string props
  const responsiveStyles = getResponsiveLayoutStyles({
    width,
    minWidth,
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

  // Container-specific styles (centered with max-width)
  const containerStyles: CSSProperties = {
    maxWidth: resolvedMaxWidth,
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  const mergedStyle = {
    ...containerStyles,
    ...responsiveStyles.style,
    ...style
  }

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
