import { clsx } from 'clsx'

import { Box, type BoxProps } from '../Box'
import { tableBase } from './Table.css'

export type TableProps = Omit<BoxProps<'table'>, 'as' | 'asChild'>

export function Table({ className, ...rest }: TableProps) {
  return <Box as="table" className={clsx(tableBase, className)} {...rest} />
}

export * from './components/TableBody'

export * from './components/TableCaption'

export * from './components/TableCell'

export * from './components/TableFooter'

export * from './components/TableHeader'

export * from './components/TableHeaderCell'

export * from './components/TableRow'

export type {
  TableAlign,
  TableCellOwnProps,
  TableCellVariant,
  TableColorProps
} from './types'
