import {
  resolveLayoutSprinklesProps,
  resolveRoundedSprinklesProps,
  resolveSpacingSprinklesProps
} from '.'
import type {
  TokenizedLayoutProps,
  TokenizedRoundedProps,
  TokenizedSpacingProps
} from '../props'

export interface TokenizedCommonProps
  extends TokenizedLayoutProps, TokenizedSpacingProps, TokenizedRoundedProps {}

export function resolveCommonSprinkleProps(
  spacing: TokenizedSpacingProps,
  layout: TokenizedLayoutProps,
  rounded: TokenizedRoundedProps
) {
  return {
    ...resolveSpacingSprinklesProps(spacing),
    ...resolveLayoutSprinklesProps(layout),
    ...resolveRoundedSprinklesProps(rounded)
  }
}
