import boxen from 'boxen'
import chalk from 'chalk'
import { toCamelCase } from '@utils/strings'

const warnings = [
  'Action Scope',
  'Recoverability',
  'Dependencies',
  'System Impact',
  'Backup Recommendation',
  'User Responsibility'
]

function printDisclaimer(t: (key: string) => string): void {
  console.log(
    chalk.red(`\n${t('moduleTools.features.delete.beforeProceed')}\n`)
  )
  console.log(
    boxen(
      warnings
        .map(
          (title, index) =>
            `${chalk.yellow.bold(
              `${(index + 1).toString().padStart(2, '0')}. `
            )}${chalk.bold(
              t(
                `moduleTools.features.delete.warnings.${toCamelCase(
                  title
                )}.title`
              )
            )}\n${chalk.gray(
              t(
                `moduleTools.features.delete.warnings.${toCamelCase(
                  title
                )}.desc`
              )
            )}`
        )
        .join('\n\n'),
      {
        padding: { top: 1, right: 2, bottom: 1, left: 2 },
        width: 80,
        borderColor: 'yellow',
        borderStyle: 'double',
        title: chalk.bold(
          `\uf071 ${t('moduleTools.features.delete.warning').toUpperCase()}`
        )
      }
    )
  )
}

export default printDisclaimer
