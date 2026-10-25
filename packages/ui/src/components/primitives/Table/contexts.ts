import { createContext } from 'react'

export type TableSection = 'header' | 'body' | 'footer'

export const TableSectionContext = createContext<TableSection>('body')
