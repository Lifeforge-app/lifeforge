import { style } from '@vanilla-extract/css'

import { COLORS } from '@lifeforge/ui'

export const sidebarLink = style({
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: '50%',
      left: '-2px',
      width: '3px',
      height: 'var(--sidebar-indicator-height, 0)',
      transform: 'translateY(-50%)',
      borderRadius: '9999px',
      backgroundColor: COLORS['custom-500'],
      transition: 'height 150ms ease'
    }
  }
})

export const sidebarLinkActive = style({
  vars: {
    '--sidebar-indicator-height': '100%'
  }
})

export const sidebarPanel = style({
  '@media': {
    '(min-width: 1280px)': {
      transform: 'translateX(0) !important'
    }
  }
})
