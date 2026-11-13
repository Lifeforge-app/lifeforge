import { globalStyle, style } from '@vanilla-extract/css'

export const tooltip = style({})

globalStyle(`${tooltip} .react-tooltip-content-wrapper`, {
  padding: '0'
})
