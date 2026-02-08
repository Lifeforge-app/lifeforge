import type { ResponsiveProp, SpaceToken } from '../../system'

// ============================================================================
// Shared Layout Props
// ============================================================================

/**
 * Common layout props shared by Box, Flex, Grid, Section, Container.
 * Following Radix UI Themes patterns.
 */
export interface LayoutProps {
  // Padding (tokenized - uses space scale)
  p?: ResponsiveProp<SpaceToken>
  px?: ResponsiveProp<SpaceToken>
  py?: ResponsiveProp<SpaceToken>
  pt?: ResponsiveProp<SpaceToken>
  pr?: ResponsiveProp<SpaceToken>
  pb?: ResponsiveProp<SpaceToken>
  pl?: ResponsiveProp<SpaceToken>

  // Size (CSS string - accepts any CSS value, supports responsive)
  width?: ResponsiveProp<string>
  minWidth?: ResponsiveProp<string>
  maxWidth?: ResponsiveProp<string>
  height?: ResponsiveProp<string>
  minHeight?: ResponsiveProp<string>
  maxHeight?: ResponsiveProp<string>

  // Positioning
  position?: ResponsiveProp<PositionValue>
  inset?: ResponsiveProp<string>
  top?: ResponsiveProp<string>
  right?: ResponsiveProp<string>
  bottom?: ResponsiveProp<string>
  left?: ResponsiveProp<string>

  // Overflow
  overflow?: ResponsiveProp<OverflowValue>
  overflowX?: ResponsiveProp<OverflowValue>
  overflowY?: ResponsiveProp<OverflowValue>

  // Flex children props
  flexBasis?: ResponsiveProp<string>
  flexGrow?: ResponsiveProp<string>
  flexShrink?: ResponsiveProp<string>

  // Grid children props
  gridArea?: ResponsiveProp<string>
  gridColumn?: ResponsiveProp<string>
  gridColumnStart?: ResponsiveProp<string>
  gridColumnEnd?: ResponsiveProp<string>
  gridRow?: ResponsiveProp<string>
  gridRowStart?: ResponsiveProp<string>
  gridRowEnd?: ResponsiveProp<string>
}

/**
 * Margin props - shared by most components, not just layout.
 */
export interface MarginProps {
  m?: ResponsiveProp<SpaceToken>
  mx?: ResponsiveProp<SpaceToken>
  my?: ResponsiveProp<SpaceToken>
  mt?: ResponsiveProp<SpaceToken>
  mr?: ResponsiveProp<SpaceToken>
  mb?: ResponsiveProp<SpaceToken>
  ml?: ResponsiveProp<SpaceToken>
}

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
