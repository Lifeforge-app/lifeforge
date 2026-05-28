import { keyframes, style } from '@vanilla-extract/css'
import { createSprinkles } from '@vanilla-extract/sprinkles'

import { themeColorProperties, vars } from '@/system'

export const sprinkles = createSprinkles(themeColorProperties)

const enterAnimation = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0.95)'
  }
})

const exitAnimation = keyframes({
  to: {
    opacity: 0,
    transform: 'scale(0.95)'
  }
})

export const content = style([
  {
    fontSize: vars.fontSize.base,
    boxShadow: 'var(--shadow-lg)',
    animationDuration: '150ms',
    selectors: {
      '&[data-state=open]': {
        animationName: enterAnimation
      },
      '&[data-state=closed]': {
        animationName: exitAnimation,
        animationFillMode: 'forwards'
      }
    }
  },
  sprinkles({
    color: { base: 'bg-500' }
  })
])
