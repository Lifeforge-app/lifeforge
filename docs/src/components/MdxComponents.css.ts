import { style } from '@vanilla-extract/css'

export const table = style({
  marginTop: '1.5rem',
  width: '100%',
  borderCollapse: 'collapse',
  border: '1.5px solid var(--color-bg-200)',
  selectors: {
    '&.dark': {
      borderColor: 'var(--color-bg-800)'
    }
  }
})

export const tableCell = style({
  border: '1.5px solid var(--color-bg-200)',
  padding: '0.5rem 1rem',
  textAlign: 'left',
  selectors: {
    '&.dark': {
      borderColor: 'var(--color-bg-800)'
    }
  }
})

export const tableCellWithBreak = style([
  tableCell,
  {
    selectors: {
      '&:first-child': {
        wordBreak: 'break-all'
      }
    }
  }
])
