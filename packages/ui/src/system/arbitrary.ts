import type { ResponsiveProp } from './responsive'

export interface ArbitrarySizeProps {
  width?: ResponsiveProp<string>
  minWidth?: ResponsiveProp<string>
  maxWidth?: ResponsiveProp<string>
  height?: ResponsiveProp<string>
  minHeight?: ResponsiveProp<string>
  maxHeight?: ResponsiveProp<string>
}

export interface ArbitraryPositionProps {
  zIndex?: ResponsiveProp<string>
  inset?: ResponsiveProp<string>
  top?: ResponsiveProp<string>
  right?: ResponsiveProp<string>
  bottom?: ResponsiveProp<string>
  left?: ResponsiveProp<string>
}

export interface ArbitraryFlexChildProps {
  flex?: ResponsiveProp<string>
  flexBasis?: ResponsiveProp<string>
  flexGrow?: ResponsiveProp<string>
  flexShrink?: ResponsiveProp<string>
}

export interface ArbitraryGridChildProps {
  gridArea?: ResponsiveProp<string>
  gridColumnSpan?: ResponsiveProp<number, string>
  gridRowSpan?: ResponsiveProp<number, string>
}

export interface ArbitraryProps
  extends
    ArbitrarySizeProps,
    ArbitraryPositionProps,
    ArbitraryFlexChildProps,
    ArbitraryGridChildProps {}
