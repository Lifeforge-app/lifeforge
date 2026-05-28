import type { TokenizedLayoutProps } from '../layout-props.css'
import type { TokenizedSpacingProps } from '../spacing-props.css'
import { resolveLayoutSprinklesProps } from './layout-props-resolvers'
import { resolveSpacingSprinklesProps } from './spacing-props-resolvers'

export interface TokenizedCommonProps
  extends TokenizedLayoutProps, TokenizedSpacingProps {}

export function resolveCommonSprinkleProps(
  spacing: TokenizedSpacingProps,
  layout: TokenizedLayoutProps
) {
  return {
    ...resolveSpacingSprinklesProps(spacing),
    ...resolveLayoutSprinklesProps(layout)
  }
}
