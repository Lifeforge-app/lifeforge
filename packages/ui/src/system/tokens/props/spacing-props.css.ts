import { defineProperties } from '@vanilla-extract/sprinkles'

import {
  RESPONSIVE_CONDITIONS,
  type ResponsiveProp,
  type SpaceToken,
  vars
} from '../..'

interface TokenizedPaddingProps {
  p?: ResponsiveProp<SpaceToken>
  px?: ResponsiveProp<SpaceToken>
  py?: ResponsiveProp<SpaceToken>
  pt?: ResponsiveProp<SpaceToken>
  pr?: ResponsiveProp<SpaceToken>
  pb?: ResponsiveProp<SpaceToken>
  pl?: ResponsiveProp<SpaceToken>
}

interface TokenizedMarginProps {
  m?: ResponsiveProp<SpaceToken>
  mx?: ResponsiveProp<SpaceToken>
  my?: ResponsiveProp<SpaceToken>
  mt?: ResponsiveProp<SpaceToken>
  mr?: ResponsiveProp<SpaceToken>
  mb?: ResponsiveProp<SpaceToken>
  ml?: ResponsiveProp<SpaceToken>
}

export interface TokenizedSpacingProps
  extends TokenizedPaddingProps, TokenizedMarginProps {}

export const tokenizedSpacingProperties = defineProperties({
  conditions: RESPONSIVE_CONDITIONS,
  defaultCondition: 'base',
  properties: {
    padding: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    margin: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space
  }
})
