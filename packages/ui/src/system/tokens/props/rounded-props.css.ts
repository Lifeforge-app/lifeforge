import { defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  type RadiusToken,
  type ResponsiveProp,
  vars
} from '../..'

export interface TokenizedRoundedProps {
  r?: ResponsiveProp<RadiusToken>
  rtl?: ResponsiveProp<RadiusToken>
  rtr?: ResponsiveProp<RadiusToken>
  rbl?: ResponsiveProp<RadiusToken>
  rbr?: ResponsiveProp<RadiusToken>
}

export const tokenizedRoundedProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    borderRadius: vars.radii,
    borderTopLeftRadius: vars.radii,
    borderTopRightRadius: vars.radii,
    borderBottomLeftRadius: vars.radii,
    borderBottomRightRadius: vars.radii
  }
})
