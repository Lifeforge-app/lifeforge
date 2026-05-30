import { globalStyle, style } from '@vanilla-extract/css'

import { COLORS, colorWithOpacity, vars } from '@/system'

export const root = style({})

/* ---- Base body/reset ---- */

globalStyle(`${root} *`, {
  color: COLORS['bg-600'],
  marginTop: 0,
  marginBottom: 0,
  lineHeight: 'normal',
  WebkitUserSelect: 'text',
  userSelect: 'text'
})

globalStyle(`.dark ${root} *`, {
  color: COLORS['bg-400']
})

/* ---- Font size / line-height scale ---- */

globalStyle(`${root}`, {
  fontSize: vars.fontSize.base,
  lineHeight: vars.lineHeight.base,
  maxWidth: '65ch'
})

/* ---- Headings ---- */

globalStyle(`${root} :is(h1, h2, h3, h4, h5, h6)`, {
  color: COLORS['bg-800'],
  fontWeight: vars.fontWeight.bold,
  marginBottom: '0.5em'
})

globalStyle(`.dark ${root} :is(h1, h2, h3, h4, h5, h6)`, {
  color: COLORS['bg-50']
})

globalStyle(`${root} h1`, {
  fontSize: vars.fontSize['4xl'],
  lineHeight: vars.lineHeight['4xl'],
  fontWeight: '800',
  marginTop: '1.5em',
  marginBottom: '0.5em'
})

globalStyle(`${root} h2`, {
  fontSize: vars.fontSize['2xl'],
  lineHeight: vars.lineHeight['2xl'],
  fontWeight: vars.fontWeight.bold,
  marginTop: '1.75em',
  marginBottom: '0.5em'
})

globalStyle(`${root} h3`, {
  fontSize: vars.fontSize.xl,
  lineHeight: vars.lineHeight.xl,
  fontWeight: vars.fontWeight.semibold,
  marginTop: '1.5em',
  marginBottom: '0.4em'
})

globalStyle(`${root} h4`, {
  fontSize: vars.fontSize.lg,
  lineHeight: vars.lineHeight.lg,
  fontWeight: vars.fontWeight.semibold,
  marginTop: '1.25em',
  marginBottom: '0.3em'
})

/* ---- Paragraphs ---- */

globalStyle(`${root} p`, {
  marginBottom: '0.75em'
})

/* ---- Links ---- */

globalStyle(`${root} a`, {
  color: COLORS['custom-500'],
  textDecoration: 'underline',
  textDecorationThickness: '1.5px',
  textUnderlineOffset: '2px',
  fontWeight: vars.fontWeight.medium
})

globalStyle(`${root} a:hover`, {
  color: COLORS['custom-600']
})

/* ---- Bold / Strong ---- */

globalStyle(`${root} strong`, {
  color: COLORS['bg-800'],
  fontWeight: vars.fontWeight.semibold
})

globalStyle(`.dark ${root} strong`, {
  color: COLORS['bg-50']
})

globalStyle(
  `${root} :is(a strong, h1 strong, h2 strong, h3 strong, h4 strong, h5 strong, h6 strong)`,
  {
    color: 'inherit'
  }
)

/* ---- Horizontal rule ---- */

globalStyle(`${root} hr`, {
  borderColor: COLORS['bg-300'],
  borderTopWidth: '1px',
  marginTop: '1.75em',
  marginBottom: '1.75em'
})

globalStyle(`.dark ${root} hr`, {
  borderColor: COLORS['bg-700']
})

/* ---- Lists ---- */

globalStyle(`${root} ul`, {
  listStyleType: 'disc',
  marginLeft: '1.5em',
  marginBottom: '0.75em'
})

globalStyle(`${root} ol`, {
  listStyleType: 'decimal',
  marginLeft: '1.5em',
  marginBottom: '0.75em'
})

globalStyle(`${root} li`, {
  marginTop: '0.25em',
  marginBottom: '0.25em',
  paddingInlineStart: '0.375em'
})

globalStyle(`${root} li::marker`, {
  color: COLORS['bg-400']
})

globalStyle(`${root} :is(ul ul, ul ol, ol ul, ol ol)`, {
  marginTop: '0.25em',
  marginBottom: '0.25em'
})

globalStyle(`${root} :is(ul > li > p, ol > li > p)`, {
  marginTop: '0.25em',
  marginBottom: '0.25em'
})

/* ---- Blockquote ---- */

globalStyle(`${root} blockquote`, {
  borderColor: COLORS['bg-300'],
  backgroundColor: COLORS['bg-200'],
  borderLeftWidth: '4px',
  borderRadius: `0 ${vars.radii.sm} ${vars.radii.sm} 0`,
  padding: '0.75em 1em',
  marginTop: '1em',
  marginBottom: '1em',
  color: COLORS['bg-700'],
  quotes: '"\\201C""\\201D""\\2018""\\2019"'
})

globalStyle(`.dark ${root} blockquote`, {
  borderColor: COLORS['bg-700'],
  backgroundColor: COLORS['bg-900'],
  color: COLORS['bg-500']
})

globalStyle(`${root} blockquote p:first-of-type::before`, {
  content: 'open-quote'
})

globalStyle(`${root} blockquote p:last-of-type::after`, {
  content: 'close-quote'
})

/* ---- Code (inline) ---- */

globalStyle(`${root} code:not(pre > code)`, {
  backgroundColor: COLORS['bg-200'],
  color: COLORS['bg-800'],
  borderRadius: vars.radii.sm,
  border: 0,
  paddingLeft: '0.375em',
  paddingRight: '0.375em',
  paddingTop: '0.125em',
  paddingBottom: '0.125em',
  fontSize: '0.875em',
  fontWeight: vars.fontWeight.semibold,
  boxShadow: '0 1px 0 0 var(--color-bg-300)'
})

globalStyle(`.dark ${root} code:not(pre > code)`, {
  backgroundColor: COLORS['bg-800'],
  boxShadow: `0 1px 0 0 ${colorWithOpacity('bg-500', '20%')}`,
  color: COLORS['bg-50']
})

globalStyle(`${root} :is(h1 code, h2 code, h3 code, h4 code, a code)`, {
  color: 'inherit'
})

/* ---- Pre (code blocks) ---- */

globalStyle(`${root} pre`, {
  backgroundColor: COLORS['bg-50'],
  padding: '1em 1.25em',
  marginTop: '1.25em',
  marginBottom: '1.25em',
  borderRadius: vars.radii.lg,
  boxShadow: 'var(--custom-shadow)',
  overflowX: 'auto',
  fontSize: '0.875em',
  lineHeight: 1.7,
  fontFamily:
    'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
})

globalStyle(`.dark ${root} pre`, {
  backgroundColor: COLORS['bg-900']
})

globalStyle(`${root} pre code`, {
  backgroundColor: 'transparent',
  borderWidth: 0,
  borderRadius: 0,
  padding: 0,
  fontWeight: vars.fontWeight.normal,
  color: 'inherit',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  lineHeight: 'inherit'
})

/* ---- Kbd ---- */

globalStyle(`${root} kbd`, {
  fontFamily: 'inherit',
  fontWeight: vars.fontWeight.medium,
  color: COLORS['bg-800'],
  backgroundColor: COLORS['bg-200'],
  borderRadius: vars.radii.sm,
  padding: '0.125em 0.375em',
  fontSize: '0.875em',
  boxShadow: '0 1px 0 0 var(--color-bg-300)'
})

globalStyle(`.dark ${root} kbd`, {
  color: COLORS['bg-50'],
  backgroundColor: COLORS['bg-800'],
  boxShadow: `0 1px 0 0 ${colorWithOpacity('bg-500', '20%')}`
})

/* ---- Tables ---- */

globalStyle(`${root} table`, {
  width: '100%',
  tableLayout: 'auto',
  marginTop: '1.25em',
  marginBottom: '1.25em',
  fontSize: vars.fontSize.sm,
  borderCollapse: 'collapse'
})

globalStyle(`${root} thead`, {
  borderBottomWidth: '1px',
  borderBottomColor: COLORS['bg-300']
})

globalStyle(`.dark ${root} thead`, {
  borderBottomColor: COLORS['bg-700']
})

globalStyle(`${root} thead th`, {
  color: COLORS['bg-800'],
  fontWeight: vars.fontWeight.semibold,
  verticalAlign: 'bottom',
  paddingTop: '0.5em',
  paddingBottom: '0.5em',
  paddingLeft: '0.75em',
  paddingRight: '0.75em',
  textAlign: 'start'
})

globalStyle(`${root} thead th:first-child`, {
  paddingLeft: 0
})

globalStyle(`${root} thead th:last-child`, {
  paddingRight: 0
})

globalStyle(`.dark ${root} thead th`, {
  color: COLORS['bg-50']
})

globalStyle(`${root} tbody tr`, {
  borderBottomWidth: '1px',
  borderBottomColor: COLORS['bg-200']
})

globalStyle(`.dark ${root} tbody tr`, {
  borderBottomColor: COLORS['bg-700']
})

globalStyle(`${root} tbody tr:last-child`, {
  borderBottomWidth: 0
})

globalStyle(`${root} :is(tbody td, tfoot td)`, {
  verticalAlign: 'baseline',
  paddingTop: '0.5em',
  paddingBottom: '0.5em',
  paddingLeft: '0.75em',
  paddingRight: '0.75em',
  textAlign: 'start'
})

globalStyle(`${root} :is(tbody td:first-child, tfoot td:first-child)`, {
  paddingLeft: 0
})

globalStyle(`${root} :is(tbody td:last-child, tfoot td:last-child)`, {
  paddingRight: 0
})

globalStyle(`${root} tfoot`, {
  borderTopWidth: '1px',
  borderTopColor: COLORS['bg-300']
})

globalStyle(`.dark ${root} tfoot`, {
  borderTopColor: COLORS['bg-700']
})

/* ---- Definition list ---- */

globalStyle(`${root} dl`, {
  marginTop: '1em',
  marginBottom: '1em'
})

globalStyle(`${root} dt`, {
  color: COLORS['bg-800'],
  fontWeight: vars.fontWeight.semibold,
  marginTop: '1em'
})

globalStyle(`.dark ${root} dt`, {
  color: COLORS['bg-50']
})

globalStyle(`${root} dd`, {
  marginTop: '0.25em',
  paddingInlineStart: '1.5em'
})

/* ---- Figure / Figcaption ---- */

globalStyle(`${root} figure`, {
  marginTop: '1.5em',
  marginBottom: '1.5em'
})

globalStyle(`${root} figure > *`, {
  marginTop: 0,
  marginBottom: 0
})

globalStyle(`${root} figcaption`, {
  color: COLORS['bg-500'],
  fontSize: vars.fontSize.sm,
  lineHeight: 1.4,
  marginTop: '0.5em',
  textAlign: 'center'
})

/* ---- Images / Video / Picture ---- */

globalStyle(`${root} img`, {
  marginTop: '1.5em',
  marginBottom: '1.5em',
  borderRadius: vars.radii.lg,
  maxWidth: '100%',
  height: 'auto'
})

globalStyle(`${root} video`, {
  marginTop: '1.5em',
  marginBottom: '1.5em',
  borderRadius: vars.radii.lg,
  maxWidth: '100%'
})

globalStyle(`${root} picture`, {
  display: 'block',
  marginTop: '1.5em',
  marginBottom: '1.5em'
})

globalStyle(`${root} picture > img`, {
  marginTop: 0,
  marginBottom: 0
})

/* ---- First / last child margin reset ---- */

globalStyle(`${root} > :first-child`, {
  marginTop: 0
})

globalStyle(`${root} > :last-child`, {
  marginBottom: 0
})

/* ---- Heading + sibling reset ---- */

globalStyle(`${root} :is(h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *)`, {
  marginTop: 0
})

globalStyle(`${root} hr + *`, {
  marginTop: 0
})
