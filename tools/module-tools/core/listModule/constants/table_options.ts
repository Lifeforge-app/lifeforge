import chalk from 'chalk'
import { getBorderCharacters, type TableUserConfig } from 'table'

const TABLE_HEADERS = [
  'Category',
  'Name',
  'Descriptions',
  'Icon',
  'Togglable',
  'Routes',
  'Additional Info'
]

const TABLE_OPTIONS: TableUserConfig = {
  header: {
    alignment: 'center',
    content: chalk.bold(chalk.blue('Module List'))
  },
  columns: [
    { width: 20, alignment: 'center' },
    { width: 20 },
    { width: 40 },
    { width: 10 },
    { width: 10, alignment: 'center' },
    { width: 30 },
    { width: 20 }
  ],
  border: Object.fromEntries(
    Object.entries(getBorderCharacters('honeywell')).map(([key, value]) => [
      key,
      chalk.ansi256(240)(value)
    ])
  )
}

export { TABLE_HEADERS, TABLE_OPTIONS }
