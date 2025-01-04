import boxen from 'boxen'
import chalk from 'chalk'

function printHelp(t: (key: string) => string): void {
  console.log(`
  ${boxen(
    `${chalk.bold(
      `${chalk.green('Lifeforge.')} ${t('moduleTools.title')}`
    )}\n${chalk.grey(t('moduleTools.description'))}`,
    {
      padding: 1,
      dimBorder: true,
      margin: 1,
      width: 50,
      textAlignment: 'center',
      borderStyle: 'double'
    }
  )}
  ${t('moduleTools.usage')} node module-tools ${chalk.green(
    `<${t('moduleTools.command')}>`
  )} ${chalk.yellow(`[${t('moduleTools.options')}]`)}
  
  ${t('moduleTools.commandsTitle')}:
    ${chalk.green('list')}    ${chalk.gray(
    t('moduleTools.commandDescriptions.list')
  )}
    ${chalk.green('create')}  ${chalk.gray(
    t('moduleTools.commandDescriptions.create')
  )}
    ${chalk.green('delete')}  ${chalk.gray(
    t('moduleTools.commandDescriptions.delete')
  )}
    ${chalk.green('update')}  ${chalk.gray(
    t('moduleTools.commandDescriptions.update')
  )}
  
  ${t('moduleTools.optionsTitle')}:
    ${chalk.yellow('-h, --help')}      ${chalk.gray(
    t('moduleTools.optionDescriptions.help')
  )}
    ${chalk.yellow('-l, --language')}  ${chalk.gray(
    t('moduleTools.optionDescriptions.language')
  )}
    ${chalk.yellow('-u, --username')}  ${chalk.gray(
    t('moduleTools.optionDescriptions.username')
  )}
    ${chalk.yellow('-p, --password')}  ${chalk.gray(
    t('moduleTools.optionDescriptions.password')
  )}
  `)
}

export default printHelp
