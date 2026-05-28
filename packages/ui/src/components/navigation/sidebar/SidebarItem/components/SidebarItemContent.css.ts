import { style } from '@vanilla-extract/css'

export const numberBadgeGroupHoverHide = style({
  selectors: {
    '.group:hover &': { display: 'none' }
  }
})

export const contextMenuGroupHoverShow = style({
  display: 'none',
  pointerEvents: 'none',
  selectors: {
    '.group:hover &': { display: 'block', pointerEvents: 'auto' },
    '[data-state="open"] &': { display: 'block', pointerEvents: 'auto' }
  }
})
