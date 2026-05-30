import type { CSSProperties } from '@vanilla-extract/css'

import { normalizeResponsiveProp } from '@/system/responsive'

import type { TokenizedRoundedProps } from '../props'

export function resolveRoundedSprinklesProps({
  r,
  rtl,
  rtr,
  rbl,
  rbr
}: TokenizedRoundedProps): Partial<Record<keyof CSSProperties, any>> {
  return {
    borderRadius: normalizeResponsiveProp(r),
    borderTopLeftRadius: normalizeResponsiveProp(rtl),
    borderTopRightRadius: normalizeResponsiveProp(rtr),
    borderBottomLeftRadius: normalizeResponsiveProp(rbl),
    borderBottomRightRadius: normalizeResponsiveProp(rbr)
  }
}
