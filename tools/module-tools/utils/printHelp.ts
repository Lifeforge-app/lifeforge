import boxen from 'boxen'
import { Chalk } from 'chalk'

const chalk = new Chalk({ level: 3 })

function printHelp(commands: string[], t: (key: string) => string): void {
  const maxCommandLength = Math.max(...commands.map(command => command.length))

  const commandsString = commands
    .map(
      command =>
        `    ${chalk.green(
          command.padEnd(maxCommandLength, ' ')
        )}  ${chalk.gray(t('moduleTools.help.commandDescriptions.' + command))}`
    )
    .join('\n')

  console.log(`

${`██╗     ██╗███████╗███████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗   
██║     ██║██╔════╝██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝   
██║     ██║█████╗  █████╗  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗     
██║     ██║██╔══╝  ██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝     
███████╗██║██║     ███████╗██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗██╗
╚══════╝╚═╝╚═╝     ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝`
  .split('\n')
  .map(line =>
    line
      .split('')
      .map(char =>
        char.charCodeAt(0).toString(16).startsWith('255')
          ? chalk.green(char)
          : chalk.white(char)
      )
      .join('')
  )
  .join('\n')}

${boxen(
  `${chalk.bold(
    `${chalk.green('Lifeforge.')} ${t('moduleTools.title')}`
  )}\n${chalk.grey(t('moduleTools.description'))}`,
  {
    padding: 1,
    dimBorder: true,
    margin: {
      top: 0,
      right: 0,
      bottom: 1,
      left: 0
    },
    width: 72,
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
${commandsString}
  
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
