import boxen from 'boxen'
import { Chalk } from 'chalk'
import { ROUTES } from '../../../constants/routes'

const chalk = new Chalk({ level: 3 })

function getLength(str: string): number {
  return [...str]
    .map(char => (char.charCodeAt(0) > 255 ? 2 : 1))
    .reduce((acc, cur) => acc + cur, 0)
}

function padNumber(
  number: number,
  length: number,
  color: 'blue' | 'green' | 'yellow' | 'cyan' = 'blue'
): string {
  return (
    chalk.ansi256(240).dim('0'.repeat(length - number.toString().length)) +
    chalk[color](number.toString())
  )
}

function getSeparator(str: string): string {
  const remainingSpace = 50 - getLength(str) - 17
  return chalk.ansi256(238).dim('.').repeat(remainingSpace)
}

function summarizeModules(
  t: (key: string) => string,
  tableWidth: number
): void {
  let totalModules = 0
  let togglableModules = 0
  let deprecatedModules = 0
  let aiEnabledModules = 0
  const categories = new Set<string>()

  ROUTES.forEach(section => {
    categories.add(section.title ?? t('noCategory'))
    section.items.forEach(item => {
      totalModules++
      if (item.togglable) togglableModules++
      if (item.deprecated === true) deprecatedModules++
      if (item.hasAI === true) aiEnabledModules++
    })
  })

  const labels = {
    totalCategories: `${t(
      'moduleTools.features.list.summary.totalCategories'
    )}`,
    totalModules: t('moduleTools.features.list.summary.totalModules'),
    togglableModules: t('moduleTools.features.list.summary.togglableModules'),
    deprecatedModules: t('moduleTools.features.list.summary.deprecatedModules'),
    aiEnabledModules: t('moduleTools.features.list.summary.aiEnabledModules')
  }

  const summary = [
    `${chalk.blue('\uf114')}  ${chalk.bold(
      labels.totalCategories
    )} ${getSeparator(labels.totalCategories)} ${padNumber(
      categories.size,
      4,
      'blue'
    )}`,

    `${chalk.blue('\uf022')}  ${chalk.bold(labels.totalModules)} ${getSeparator(
      labels.totalModules
    )} ${padNumber(totalModules, 4, 'blue')}`,

    `${chalk.green('\uf204')}  ${chalk.bold(
      labels.togglableModules
    )} ${getSeparator(labels.togglableModules)} ${padNumber(
      togglableModules,
      4,
      'green'
    )}`,

    `${chalk.yellow('\uf52f')}  ${chalk.bold(
      labels.deprecatedModules
    )} ${getSeparator(labels.deprecatedModules)} ${padNumber(
      deprecatedModules,
      4,
      'yellow'
    )}`,

    `${chalk.cyan('\uf0d0')}  ${chalk.bold(
      labels.aiEnabledModules
    )} ${getSeparator(labels.aiEnabledModules)} ${padNumber(
      aiEnabledModules,
      4,
      'cyan'
    )}`
  ].join('\n')

  console.log(
    boxen(summary, {
      width: 50,
      padding: 1,
      margin: {
        left: (tableWidth - 50) / 2,
        right: (tableWidth - 50) / 2
      },
      borderStyle: 'double',
      borderColor: 'gray',
      title: chalk.bold(
        chalk.white(t('moduleTools.features.list.summary.title'))
      ),
      titleAlignment: 'center'
    })
  )
}

export default summarizeModules
