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

import { Slot } from '../Slot'
import {
  type BorderedSprinkles,
  borderedBase,
  borderedSprinkles
} from './Bordered.css'

// ─── Token types ──────────────────────────────────────────────────────────────

type DisplayValue = 'block' | 'inline' | 'inline-block' | 'none' | 'contents'

/** Which edge(s) the border is drawn on. */
export type BorderSide = 'all' | 'top' | 'right' | 'bottom' | 'left' | 'x' | 'y'

/** CSS border-style values supported by the primitive. */
export type BorderStyleValue = 'solid' | 'dashed' | 'dotted' | 'double' | 'none'

const DEFAULT_ELEMENT = 'div' as const

// ─── Props ────────────────────────────────────────────────────────────────────

interface BorderedOwnProps<T extends ElementType = typeof DEFAULT_ELEMENT>
  extends LayoutProps, MarginProps {
  as?: T
  asChild?: boolean
  ref?: Ref<HTMLElement>
  display?: ResponsiveProp<DisplayValue>

  // ── Border ────────────────────────────────────────────────────────────────
  /** Theme-adaptive border color. Defaults to `{ base: 'bg-200', dark: 'bg-700' }`. */
  borderColor?: ThemeConditionProp<ColorToken>
  /** CSS border-width value. Accepts any valid CSS length, e.g. `'1px'`, `'2px'`, `'0.125rem'`. Defaults to `'1px'`. */
  borderWidth?: string
  /** CSS border-style. Defaults to `'solid'`. */
  borderStyle?: BorderStyleValue
  /** Which side(s) to apply the border to. Defaults to `'all'`. */
  borderSide?: BorderSide

  // ── Container ────────────────────────────────────────────────────────────
  /** Theme-adaptive background color. */
  bg?: ThemeConditionProp<ColorToken>
  /** Theme-adaptive text color for all descendants. */
  color?: ThemeConditionProp<ColorToken>
  /** Border-radius token. */
  rounded?: ResponsiveProp<RadiusToken>
  /** Adds `var(--custom-shadow)` box-shadow. */
  shadow?: boolean

  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export type BorderedProps<T extends ElementType = typeof DEFAULT_ELEMENT> =
  BorderedOwnProps<T> &
    Omit<ComponentPropsWithRef<T>, keyof BorderedOwnProps<T>>

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Computes the border-related inline style object from the side/width/style
 * combination, so that only the requested edges are visible.
 *
 * When `side` is not `'all'`, inactive sides are explicitly reset to `none`
 * via the `borderStyle` shorthand, preventing inherited or default values
 * from leaking through.
 */
function computeBorderStyles(
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

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * A layout primitive that renders a configurable border around its children.
 *
 * All border geometry props (`borderWidth`, `borderStyle`, `borderSide`) are
 * handled via inline styles; the adaptive `borderColor` is resolved through
 * the vanilla-extract sprinkle so dark-mode and hover conditions work without
 * extra class names.
 */
export function Bordered<T extends ElementType = typeof DEFAULT_ELEMENT>({
  as,
  asChild = false,
  ref,
  display,
  // Border props
  borderColor = { base: 'bg-200', dark: 'bg-700' },
  borderStyle = 'solid',
  borderSide = 'all',
  borderWidth = '1px',
  // Container props
  bg,
  color,
  rounded,
  shadow,
  // Layout props (CSS string — responsive)
  bottom,
  flex,
  flexBasis,
  flexGrow,
  flexShrink,
  gridArea,
  gridColumn,
  gridColumnEnd,
  gridColumnStart,
  gridRow,
  gridRowEnd,
  gridRowStart,
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
  const sprinklesClassName = borderedSprinkles({
    backgroundColor: bg as BorderedSprinkles['backgroundColor'],
    borderColor: borderColor as BorderedSprinkles['borderColor'],
    borderRadius: normalizeResponsiveProp(
      rounded
    ) as BorderedSprinkles['borderRadius'],
    color: color as BorderedSprinkles['color'],
    display: normalizeResponsiveProp(display) as BorderedSprinkles['display'],
    ...resolveCommonSprinkleProps({
      m,
      mb,
      ml,
      mr,
      mt,
      mx,
      my,
      overflow,
      overflowX,
      overflowY,
      p,
      pb,
      pl,
      position,
      pr,
      pt,
      px,
      py
    })
  })

  const responsiveStyles = getResponsiveLayoutStyles({
    bottom,
    flex,
    flexBasis,
    flexGrow,
    flexShrink,
    gridArea,
    gridColumn,
    gridColumnEnd,
    gridColumnStart,
    gridRow,
    gridRowEnd,
    gridRowStart,
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
    zIndex
  })

  const mergedStyle: CSSProperties = {
    ...computeBorderStyles(borderSide, borderWidth, borderStyle),
    ...responsiveStyles.style,
    ...style
  }

  const Component = asChild ? Slot : (as ?? DEFAULT_ELEMENT)

  return (
    <Component
      ref={ref as Ref<never>}
      className={clsx(
        borderedBase(),
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
