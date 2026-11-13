import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

import { COLORS, colorWithOpacity, vars } from '@/system'

const stripeBackground = colorWithOpacity('bg-500', '5%').toString()
const stripeBackgroundDark = colorWithOpacity('bg-400', '5%').toString()

export const tableBase = style({
  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0
})

export const headerRowBorder = style({
  selectors: {
    '&:last-child': {
      borderBottom: `2px solid ${COLORS['bg-300']}`
    },
    '.dark &:last-child': {
      borderBottomColor: COLORS['bg-700']
    }
  }
})

export const footerBorder = style({
  borderTop: `1px solid ${COLORS['bg-300']}`,
  selectors: {
    '.dark &': {
      borderTopColor: COLORS['bg-700']
    }
  }
})

export const bodyRowStripe = style({
  selectors: {
    '&:nth-child(odd)': {
      backgroundColor: stripeBackground
    },
    '.dark &:nth-child(odd)': {
      backgroundColor: stripeBackgroundDark
    }
  }
})

export const cellBase = style({
  paddingTop: vars.space.sm,
  paddingBottom: vars.space.sm,
  paddingLeft: vars.space.md,
  paddingRight: vars.space.md,
  verticalAlign: 'middle'
})

export const cellAlign = recipe({
  variants: {
    align: {
      left: {
        textAlign: 'left'
      },
      center: {
        textAlign: 'center'
      },
      right: {
        textAlign: 'right'
      }
    }
  },
  defaultVariants: {
    align: 'left'
  }
})

export const cellNowrap = recipe({
  variants: {
    nowrap: {
      true: {
        whiteSpace: 'nowrap'
      },
      false: {
        whiteSpace: 'normal'
      }
    }
  },
  defaultVariants: {
    nowrap: false
  }
})

export const headerCell = style({
  fontWeight: 500
})

export const totalCell = style({
  borderTop: '2px solid',
  borderBottom: '6px double',
  fontWeight: 500
})

export const headerDefaultColor = style({
  color: COLORS['bg-500'],
  selectors: {
    '.dark &': {
      color: COLORS['bg-400']
    }
  }
})

export const caption = style({
  color: COLORS['bg-500'],
  fontSize: vars.fontSize.sm,
  paddingTop: vars.space.sm,
  paddingBottom: vars.space.sm,
  textAlign: 'left',
  selectors: {
    '.dark &': {
      color: COLORS['bg-400']
    }
  }
})
