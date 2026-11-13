import type { ColorValue, ThemeConditionProp } from '@/system'

export type TableAlign = 'left' | 'center' | 'right'

export type TableCellVariant = 'default' | 'total'

export interface TableColorProps {
  bg?: ThemeConditionProp<ColorValue>
  color?: ThemeConditionProp<ColorValue>
}

export interface TableCellOwnProps extends TableColorProps {
  align?: TableAlign
  nowrap?: boolean
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
}
