/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import chalk from 'chalk'
import { table, type SpanningCellConfig } from 'table'
import { toCamelCase } from '@utils/strings'
import { ROUTES } from '../../../constants/routes'
import { TABLE_HEADERS, TABLE_OPTIONS } from '../constants/table_options'
import wrapRoutes from '../helpers/wrapRoutes'
import wrapText from '../helpers/wrapText'

function listModules(t: (key: string) => string): string {
  const spanningCells: SpanningCellConfig[] = []
  let currentRowIndex = 1

  const tableData = [
    TABLE_HEADERS.map(header =>
      chalk.bold(t(`moduleTools.features.list.headers.${toCamelCase(header)}`))
    )
  ]

  ROUTES.forEach(section => {
    const title = wrapText(
      section.title ? t(`modules.title.${toCamelCase(section.title)}`) : '',
      20,
      2
    )
    const sectionStartIndex = currentRowIndex

    section.items.forEach(item => {
      const name = wrapText(t(`modules.${toCamelCase(item.name)}`), 20, 2)
      const desc = wrapText(
        t(`modules.descriptions.${toCamelCase(item.name)}`),
        40,
        3
      )
      const icon = wrapText(item.icon || 'No Icon', 10, 2)
      const togglable = item.togglable
        ? chalk.green(t('moduleTools.misc.yes'))
        : chalk.red(t('moduleTools.misc.no'))
      const routes = wrapRoutes(item.routes, 30)
      const additionalInfo = wrapText(
        [
          item.deprecated ? chalk.yellow('Deprecated') : null,
          item.hasAI ? chalk.blue('AI Enabled') : null,
          item.requiredAPIKeys
            ? `API Keys: ${item.requiredAPIKeys.join(', ')}`
            : null
        ]
          .filter(Boolean)
          .join(', '),
        20,
        3
      )

      tableData.push([
        title,
        name,
        desc,
        icon,
        togglable,
        routes,
        additionalInfo
      ])
      currentRowIndex++
    })

    // Configure spanning cell for the category title
    spanningCells.push({
      col: 0,
      row: sectionStartIndex,
      rowSpan: section.items.length,
      alignment: 'center',
      verticalAlignment: 'middle'
    })
  })

  const tableOptions = {
    ...TABLE_OPTIONS,
    spanningCells
  }

  const result = table(tableData, tableOptions)
  console.log(result)

  return result
}

export default listModules
