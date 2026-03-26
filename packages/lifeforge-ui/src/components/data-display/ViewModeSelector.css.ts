import { style } from '@vanilla-extract/css'

import { bg } from '@/styles/vanilla-extract'
import { withOpacity } from '@/styles/vanilla-extract/utils'

import { vars } from '../../system'

// container styling (shadow, background, border, radius)
export const container = style({
  boxShadow: 'var(--custom-shadow)',
  backgroundColor: bg[50],
  borderColor: withOpacity(bg[500], 0.2),
  borderRadius: vars.radii.lg,
  selectors: {
    '.dark &': {
      backgroundColor: bg[900],
      borderColor: withOpacity(bg[500], 0.5)
    },
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid'
    }
  }
})

// padding sizes for the outer wrapper
export const containerSize = {
  small: style({ padding: vars.space.xs }),
  default: style({ padding: vars.space.sm })
}

// individual option base styles
export const option = style({
  flex: 1,
  borderRadius: vars.radii.md,
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm
})

// padding/font sizes for each button variant
export const optionSize = {
  small: style({
    padding: `${vars.space.xs} ${vars.space.sm}`,
    fontSize: vars.fontSize.sm
  }),
  default: style({
    padding: `${vars.space.sm} ${vars.space.md}`,
    fontSize: vars.fontSize.base
  })
}

// styles applied when an option is active/selected
export const optionActive = style({
  backgroundColor: withOpacity(bg[200], 0.5),
  borderColor: withOpacity(bg[500], 0.2),
  fontWeight: vars.fontWeight.semibold,
  selectors: {
    '.dark &': {
      backgroundColor: bg[800]
    },
    '.bordered &': {
      borderWidth: '2px',
      borderStyle: 'solid'
    }
  }
})

// styles for inactive option state
export const optionInactive = style({
  color: bg[500],
  selectors: {
    '&:hover': {
      color: bg[800]
    },
    '.dark &:hover': {
      color: bg[50]
    }
  }
})

// icon size helper (Tailwind "size-6" ~ 1.5rem)
export const iconSize = style({
  width: '1.5rem',
  height: '1.5rem'
})
