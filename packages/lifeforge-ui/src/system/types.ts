import type { ResponsiveProp } from './responsive'
import type { SpaceToken } from './tokens.css'

// ============================================================================
// Theme-condition types (Option A: prop-level dark/hover conditions)
// ============================================================================

/** The condition keys used in sprinkles for theme-adaptive props. */
export type ThemeCondition =
  | 'base'
  | 'dark'
  | 'hover'
  | 'darkHover'
  | 'hasBgImage'
  | 'darkHasBgImage'

/**
 * A prop that accepts either a plain value or a map of per-condition values.
 * Mirrors the vanilla-extract sprinkles condition syntax.
 *
 * @example
 * bg="surface"                              // single value
 * bg={{ base: 'bg-50', dark: 'bg-900' }}   // per-condition
 */
export type ThemeConditionProp<T> = T | Partial<Record<ThemeCondition, T>>

// ============================================================================
// Granular prop groups
// ============================================================================

export interface PaddingProps {
  p?: ResponsiveProp<SpaceToken>
  px?: ResponsiveProp<SpaceToken>
  py?: ResponsiveProp<SpaceToken>
  pt?: ResponsiveProp<SpaceToken>
  pr?: ResponsiveProp<SpaceToken>
  pb?: ResponsiveProp<SpaceToken>
  pl?: ResponsiveProp<SpaceToken>
}

export interface MarginProps {
  m?: ResponsiveProp<SpaceToken>
  mx?: ResponsiveProp<SpaceToken>
  my?: ResponsiveProp<SpaceToken>
  mt?: ResponsiveProp<SpaceToken>
  mr?: ResponsiveProp<SpaceToken>
  mb?: ResponsiveProp<SpaceToken>
  ml?: ResponsiveProp<SpaceToken>
}

export interface SizeProps {
  width?: ResponsiveProp<string>
  minWidth?: ResponsiveProp<string>
  maxWidth?: ResponsiveProp<string>
  height?: ResponsiveProp<string>
  minHeight?: ResponsiveProp<string>
  maxHeight?: ResponsiveProp<string>
}

export interface PositionProps {
  position?: ResponsiveProp<PositionValue>
  inset?: ResponsiveProp<string>
  top?: ResponsiveProp<string>
  right?: ResponsiveProp<string>
  bottom?: ResponsiveProp<string>
  left?: ResponsiveProp<string>
}

export interface OverflowProps {
  overflow?: ResponsiveProp<OverflowValue>
  overflowX?: ResponsiveProp<OverflowValue>
  overflowY?: ResponsiveProp<OverflowValue>
}

export interface FlexChildProps {
  flexBasis?: ResponsiveProp<string>
  flexGrow?: ResponsiveProp<string>
  flexShrink?: ResponsiveProp<string>
}

export interface GridChildProps {
  gridArea?: ResponsiveProp<string>
  gridColumn?: ResponsiveProp<string>
  gridColumnStart?: ResponsiveProp<string>
  gridColumnEnd?: ResponsiveProp<string>
  gridRow?: ResponsiveProp<string>
  gridRowStart?: ResponsiveProp<string>
  gridRowEnd?: ResponsiveProp<string>
}

// ============================================================================
// Composite layout interface
// ============================================================================

/**
 * Common layout props shared by Box, Flex, Grid, Section, Container.
 * Composed from granular interfaces for easier extension and reuse.
 */
export interface LayoutProps
  extends
    PaddingProps,
    SizeProps,
    PositionProps,
    OverflowProps,
    FlexChildProps,
    GridChildProps {}

// ============================================================================
// Value Types
// ============================================================================

export type PositionValue =
  | 'static'
  | 'relative'
  | 'absolute'
  | 'fixed'
  | 'sticky'

export type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'auto'

export type DisplayValue =
  | 'block'
  | 'inline'
  | 'inline-block'
  | 'none'
  | 'contents'

export type FlexDisplayValue = 'none' | 'flex' | 'inline-flex'

export type GridDisplayValue = 'none' | 'grid' | 'inline-grid'
