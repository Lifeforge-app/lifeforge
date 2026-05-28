import { defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  type ResponsiveProp,
  normalizeResponsiveProp
} from '..'

export type PositionValue =
  | 'static'
  | 'relative'
  | 'absolute'
  | 'fixed'
  | 'sticky'

export type OverflowValue = 'visible' | 'hidden' | 'scroll' | 'auto'

export interface TokenizedLayoutProps {
  overflow?: ResponsiveProp<OverflowValue>
  overflowX?: ResponsiveProp<OverflowValue>
  overflowY?: ResponsiveProp<OverflowValue>
  position?: ResponsiveProp<PositionValue>
}

export const tokenizedLayoutProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    overflow: ['visible', 'hidden', 'scroll', 'auto'],
    overflowX: ['visible', 'hidden', 'scroll', 'auto'],
    overflowY: ['visible', 'hidden', 'scroll', 'auto']
  }
})
