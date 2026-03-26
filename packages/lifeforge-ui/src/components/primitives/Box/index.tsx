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
  resolveCommonSprinkleProps
} from '@/system'

import { Slot } from '../Slot'
import { shadowClass } from '../styles/common.css'
import { type BoxSprinkles, boxBase, boxSprinkles } from './box.css'

type RadiusValue = RadiusToken

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

const DEFAULT_ELEMENT = 'div' as const

interface BoxOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
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
