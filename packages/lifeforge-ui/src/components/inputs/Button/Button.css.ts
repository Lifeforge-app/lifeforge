import { recipe } from '@vanilla-extract/recipes'

import { plain, plainDangerous } from './styles/plain.css'
import { primary, primaryDangerous } from './styles/primary.css'
import { secondary, secondaryDangerous } from './styles/secondary.css'
import { tertiary, tertiaryDangerous } from './styles/tertiary.css'

export const buttonRecipe = recipe({
  variants: {
    variant: {
      primary,
      secondary,
      tertiary,
      plain
    },
    dangerous: {
      true: {}
    }
  },
  compoundVariants: [
    {
      variants: { variant: 'primary', dangerous: true },
      style: primaryDangerous
    },
    {
      variants: { variant: 'secondary', dangerous: true },
      style: secondaryDangerous
    },
    {
      variants: { variant: 'tertiary', dangerous: true },
      style: tertiaryDangerous
    },
    {
      variants: { variant: 'plain', dangerous: true },
      style: plainDangerous
    }
  ],
  defaultVariants: {
    variant: 'primary',
    dangerous: false
  }
})
