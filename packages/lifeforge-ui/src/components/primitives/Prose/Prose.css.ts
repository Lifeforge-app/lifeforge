import { style, globalStyle } from '@vanilla-extract/css'

export const root = style({})

globalStyle(`${root} *`, {
  color: 'var(--color-bg-600)',
  marginTop: 0,
  marginBottom: 0,
  lineHeight: 'normal',
  WebkitUserSelect: 'text',
  userSelect: 'text'
})

globalStyle(`.dark ${root} *`, {
  color: 'var(--color-bg-400)'
})

globalStyle(`${root} :is(h1, h2, h3, h4, h5, h6)`, {
  color: 'var(--color-bg-800)',
  fontSize: '1.125rem',
  fontWeight: 600
})

globalStyle(`.dark ${root} :is(h1, h2, h3, h4, h5, h6)`, {
  color: 'var(--color-bg-50)'
})

globalStyle(`${root} hr`, {
  borderColor: 'var(--color-bg-300)',
  marginTop: '1rem',
  marginBottom: '1rem'
})

globalStyle(`.dark ${root} hr`, {
  borderColor: 'var(--color-bg-700)'
})

globalStyle(`${root} li`, {
  paddingInlineStart: '0 !important',
  margin: '0 !important',
  padding: '0 !important',
  verticalAlign: 'top',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
})

globalStyle(`${root} li::before`, {
  content: '',
  position: 'absolute',
  top: '0.6rem',
  left: '-1rem',
  height: '5px',
  width: '5px',
  borderRadius: '9999px',
  backgroundColor: 'var(--color-bg-800)'
})

globalStyle(`.dark ${root} li::before`, {
  backgroundColor: 'var(--color-bg-100)'
})

globalStyle(`${root} ul`, {
  paddingInlineStart: '0 !important',
  marginLeft: '1.25rem',
  marginRight: '1.25rem',
  listStyleType: 'disc',
  lineHeight: 0.5
})

globalStyle(`${root} ol`, {
  paddingInlineStart: '0 !important',
  marginLeft: '1.25rem',
  marginRight: '1.25rem',
  listStyleType: 'decimal'
})

globalStyle(`${root} blockquote`, {
  borderColor: 'var(--color-bg-300)',
  backgroundColor: 'var(--color-bg-200)',
  marginTop: '1rem',
  marginBottom: '1rem',
  borderRadius: '0.125rem',
  borderLeftWidth: '4px',
  paddingLeft: '1rem',
  paddingRight: '1rem'
})

globalStyle(`.dark ${root} blockquote`, {
  borderColor: 'var(--color-bg-700)',
  backgroundColor: 'rgb(from var(--color-bg-900) r g b / 0.5)'
})

globalStyle(`${root} pre`, {
  backgroundColor: 'var(--color-bg-100)',
  marginTop: '1rem',
  marginBottom: '1rem',
  borderRadius: '0.125rem',
  boxShadow: 'var(--custom-shadow)'
})

globalStyle(`.dark ${root} pre`, {
  backgroundColor: 'rgb(from var(--color-bg-800) r g b / 0.5)'
})

globalStyle(`${root} code:not(pre > code)`, {
  backgroundColor: 'var(--color-bg-200)',
  color: 'var(--color-bg-800)',
  borderRadius: '0.125rem',
  border: 0,
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  paddingTop: '0.125rem',
  paddingBottom: '0.125rem',
  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
})

globalStyle(`.dark ${root} code:not(pre > code)`, {
  backgroundColor: 'rgb(from var(--color-bg-900) r g b / 0.5)',
  color: 'var(--color-bg-50)'
})
