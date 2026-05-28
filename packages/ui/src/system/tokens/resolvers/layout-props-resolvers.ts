import { normalizeResponsiveProp } from '@/system/responsive'

import type { TokenizedLayoutProps } from '../layout-props.css'

export function resolveLayoutSprinklesProps({
  position,
  overflow,
  overflowX,
  overflowY
}: TokenizedLayoutProps) {
  return {
    position: normalizeResponsiveProp(position),
    overflow: normalizeResponsiveProp(overflow),
    overflowX: normalizeResponsiveProp(overflowX),
    overflowY: normalizeResponsiveProp(overflowY)
  }
}
