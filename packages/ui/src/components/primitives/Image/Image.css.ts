import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const imageFill = style({
  height: '100%',
  width: '100%'
})

export const imageFit = recipe({
  variants: {
    fit: {
      cover: {
        objectFit: 'cover'
      },
      contain: {
        objectFit: 'contain'
      },
      fill: {
        objectFit: 'fill'
      },
      none: {
        objectFit: 'none'
      },
      'scale-down': {
        objectFit: 'scale-down'
      }
    }
  },
  defaultVariants: {
    fit: 'cover'
  }
})
