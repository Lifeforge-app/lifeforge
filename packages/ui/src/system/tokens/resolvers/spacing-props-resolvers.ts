import { normalizeResponsiveProp } from '@/system/responsive'

import type { TokenizedSpacingProps } from '../props'

export function resolveSpacingSprinklesProps({
  p,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  m,
  mx,
  my,
  mt,
  mr,
  mb,
  ml
}: TokenizedSpacingProps) {
  return {
    padding: normalizeResponsiveProp(p),
    paddingTop: normalizeResponsiveProp(pt ?? py),
    paddingBottom: normalizeResponsiveProp(pb ?? py),
    paddingLeft: normalizeResponsiveProp(pl ?? px),
    paddingRight: normalizeResponsiveProp(pr ?? px),
    margin: normalizeResponsiveProp(m),
    marginTop: normalizeResponsiveProp(mt ?? my),
    marginBottom: normalizeResponsiveProp(mb ?? my),
    marginLeft: normalizeResponsiveProp(ml ?? mx),
    marginRight: normalizeResponsiveProp(mr ?? mx)
  }
}
