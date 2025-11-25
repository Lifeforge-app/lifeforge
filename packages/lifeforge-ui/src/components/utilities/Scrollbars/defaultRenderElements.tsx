import React, { type CSSProperties, type ReactElement } from 'react'

interface RenderElementProps {
  style?: CSSProperties
  [key: string]: unknown
}

export function renderViewDefault(props: RenderElementProps): ReactElement {
  return <div {...props} />
}

export function renderTrackHorizontalDefault({
  style,
  ...props
}: RenderElementProps): ReactElement {
  return <div style={style} {...props} />
}

export function renderTrackVerticalDefault({
  style,
  ...props
}: RenderElementProps): ReactElement {
  return <div style={style} {...props} />
}

export function renderThumbHorizontalDefault({
  style,
  ...props
}: RenderElementProps): ReactElement {
  const finalStyle: CSSProperties = {
    ...style,
    cursor: 'pointer',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0,0,0,.2)'
  }

  return <div style={finalStyle} {...props} />
}

export function renderThumbVerticalDefault({
  style,
  ...props
}: RenderElementProps): ReactElement {
  const finalStyle: CSSProperties = {
    ...style,
    cursor: 'pointer',
    borderRadius: 'inherit',
    backgroundColor: 'rgba(0,0,0,.2)'
  }

  return <div style={finalStyle} {...props} />
}
