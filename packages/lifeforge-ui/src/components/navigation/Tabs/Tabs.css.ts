import { style } from '@vanilla-extract/css'
import { createSprinkles } from '@vanilla-extract/sprinkles'

import { themeColorProperties, vars } from '@/system'

const sprinkles = createSprinkles(themeColorProperties)

export const tab = style({
  cursor: 'pointer',
  borderStyle: 'none',
  borderBottomStyle: 'solid',
  borderBottomWidth: '2px',
  letterSpacing: '0.1em',
  whiteSpace: 'nowrap',
  textTransform: 'uppercase',
  transition: 'all 0.2s'
})

export const activeTab = sprinkles({
  color: { base: 'custom-500' },
  borderColor: { base: 'custom-500' }
})

export const inactiveTab = sprinkles({
  color: {
    base: 'bg-400',
    hover: 'bg-800',
    dark: 'bg-500',
    darkHover: 'bg-200'
  },
  borderColor: {
    base: 'bg-400',
    hover: 'bg-800',
    dark: 'bg-500',
    darkHover: 'bg-200'
  }
})

export const amount = style({
  fontSize: vars.fontSize.sm
})
