import { globalStyle, style } from '@vanilla-extract/css'

export const scannerContainer = style({
  height: '100% !important',
  width: '100% !important'
})

globalStyle(`${scannerContainer} svg`, {
  height: '100% !important',
  width: '100% !important'
})

globalStyle(`${scannerContainer} div div div:has(svg)`, {
  display: 'none'
})

export const scannerVideo = style({
  left: '50% !important',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  position: 'absolute !important' as any,
  top: '50% !important',
  transform: 'translate(-50%, -50%) !important'
})
