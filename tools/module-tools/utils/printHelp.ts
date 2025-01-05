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
  ${chalk.bold(t('moduleTools.help.usage'))} ${chalk.green(
    'node'
  )} ${chalk.magenta('module-tools')} ${chalk.green(
    `<${t('moduleTools.help.command')}>`
  )} ${chalk.yellow(`[${t('moduleTools.help.options')}]`)}
  
  ${chalk.bold(t('moduleTools.help.commandsTitle'))}:
    ${chalk.green('list')}    ${chalk.gray(
    t('moduleTools.help.commandDescriptions.list')
  )}
    ${chalk.green('create')}  ${chalk.gray(
    t('moduleTools.help.commandDescriptions.create')
  )}
    ${chalk.green('delete')}  ${chalk.gray(
    t('moduleTools.help.commandDescriptions.delete')
  )}
    ${chalk.green('update')}  ${chalk.gray(
    t('moduleTools.help.commandDescriptions.update')
  )}
  
  ${chalk.bold(t('moduleTools.help.optionsTitle'))}:
    ${chalk.yellow('-h, --help')}      ${chalk.gray(
    t('moduleTools.help.optionDescriptions.help')
  )}
    ${chalk.yellow('-l, --language')}  ${chalk.gray(
    t('moduleTools.help.optionDescriptions.language')
  )}
    ${chalk.yellow('-u, --username')}  ${chalk.gray(
    t('moduleTools.help.optionDescriptions.username')
  )}
    ${chalk.yellow('-p, --password')}  ${chalk.gray(
    t('moduleTools.help.optionDescriptions.password')
  )}
  `)
}

export default printHelp
