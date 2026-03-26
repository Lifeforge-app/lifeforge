// Internal system exports — not for public consumption

export {
  vars,
  type SpaceToken,
  type RadiusToken,
  type FontSizeToken,
  type FontWeightToken
} from './vars.css'

export {
  colors,
  bg,
  custom,
  withOpacity,
  type ColorToken,
  type BgColorSlot,
  type CustomColorSlot
} from './colors'

export {
  normalizeResponsiveProp,
  responsiveConditions,
  type Breakpoint,
  type ResponsiveProp
} from './responsive'

export type {
  ThemeCondition,
  ThemeConditionProp,
  PaddingProps,
  MarginProps,
  SizeProps,
  PositionProps,
  OverflowProps,
  FlexChildProps,
  GridChildProps,
  LayoutProps,
  PositionValue,
  OverflowValue,
  DisplayValue,
  FlexDisplayValue,
  GridDisplayValue
} from './types'

export {
  layoutPropDefs,
  getResponsiveStyles,
  getResponsiveLayoutStyles,
  resolveCommonSprinkleProps,
  type PropDef,
  type LayoutPropDefsKey,
  type CommonSprinkleInput
} from './layout-utils'

export {
  commonProperties,
  themeColorProperties,
  commonSprinkles,
  type CommonSprinkles
} from './sprinkles.css'
