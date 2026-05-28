import { clsx } from 'clsx'
import {
  type CSSProperties,
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  type Ref
} from 'react'

import {
  type ColorToken,
  type LayoutProps,
  type MarginProps,
  type RadiusToken,
  type ResponsiveProp,
  type ThemeConditionProp,
  getResponsiveLayoutStyles,
  normalizeResponsiveProp,
  resolveCommonSprinkleProps,
  shadowClass
} from '@/system'
import { normalizeGridSpan } from '@/system/grid-utils'

import { Slot } from '../Slot'
import { type BoxSprinkles, boxBase, boxSprinkles } from './Box.css'

type RadiusValue = RadiusToken

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

interface BoxOwnProps<T extends ElementType = 'div'>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<DisplayValue>
  bg?: ThemeConditionProp<ColorToken>
  rounded?: ResponsiveProp<RadiusValue>
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
  // Build sprinkles className for tokenized props
  const sprinklesClassName = boxSprinkles({
    display: normalizeResponsiveProp(display) as BoxSprinkles['display'],
    backgroundColor: bg as BoxSprinkles['backgroundColor'],
    borderRadius: normalizeResponsiveProp(
      rounded
    ) as BoxSprinkles['borderRadius'],
    ...resolveCommonSprinkleProps({
      p,
      px,
      py,
      pt,
      pr,
      pb,
      pl,
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
    })
  })

  // Build responsive styles for CSS string props (now with breakpoint support!)
  const responsiveStyles = getResponsiveLayoutStyles({
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
    gridColumnSpan: normalizeResponsiveProp(gridColumnSpan, normalizeGridSpan) as ResponsiveProp<string> | undefined,
    gridRowSpan: normalizeResponsiveProp(gridRowSpan, normalizeGridSpan) as ResponsiveProp<string> | undefined
  })

  const mergedStyle =
    Object.keys(responsiveStyles.style).length > 0
      ? { ...responsiveStyles.style, ...style }
      : style

  const Component = asChild ? Slot : (as ?? 'div')

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(
        boxBase(),
        sprinklesClassName,
        responsiveStyles.className,
        shadow && shadowClass,
        className
      )}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  )
}
