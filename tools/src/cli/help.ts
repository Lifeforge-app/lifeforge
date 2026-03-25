import chalk from 'chalk'
import { Command } from 'commander'

import logger from '@/utils/logger'

const LOGO = chalk.bold.green(`
██╗     ██╗███████╗███████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██║     ██║██╔════╝██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
██║     ██║█████╗  █████╗  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
██║     ██║██╔══╝  ██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
███████╗██║██║     ███████╗██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚══════╝╚═╝╚═╝     ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                                                                     
`)

const SECTION_ICONS: Record<string, string> = {
  Commands: '📦',
  Options: '⚙️ ',
  Arguments: '📋',
  Usage: '🚀',
  Description: '📖'
}

function formatSectionTitle(title: string): string {
  const icon = SECTION_ICONS[title] || '•'

  return `\n${icon} ${chalk.bold.underline.yellow(title)}\n`
}

function formatCommand(name: string, description: string): string {
  const paddedName = name.padEnd(20)

  return `   ${chalk.cyan(paddedName)} ${chalk.dim('│')} ${chalk.white(description)}`
}

function formatOption(flags: string, description: string): string {
  const paddedFlags = flags.padEnd(25)

  return `   ${chalk.green(paddedFlags)} ${chalk.dim('│')} ${chalk.white(description)}`
}

function formatArgument(name: string, description: string): string {
  const paddedName = name.padEnd(20)

  return `   ${chalk.magenta(paddedName)} ${chalk.dim('│')} ${chalk.white(description)}`
}

export function configureHelp(program: Command): void {
  program.configureHelp({
    formatHelp: (cmd, helper) => {
      const output: string[] = []

      // Show logo only for root command
      if (!cmd.parent) {
        output.push(LOGO)
      } else {
        output.push('')
        output.push(
          `   ${chalk.bold.cyan('forge')} ${chalk.yellow(cmd.name())} ${chalk.dim('- ' + cmd.description())}`
        )
        output.push('')
      }

      // Usage
      output.push(formatSectionTitle('Usage'))

      const usage = helper
        .commandUsage(cmd)
        .replace(/\bforge\b/, chalk.magenta('forge'))
        .replace(/\[options\]/g, chalk.green('[options]'))
        .replace(/\[command\]/g, chalk.cyan('[command]'))

      output.push(`   ${chalk.dim('$')} ${usage}`)

      // Description for subcommands
      if (cmd.parent && cmd.description()) {
        output.push(formatSectionTitle('Description'))
        output.push(`   ${chalk.white(cmd.description())}`)
      }

      // Arguments
      const args = helper.visibleArguments(cmd)

      if (args.length > 0) {
        output.push(formatSectionTitle('Arguments'))

        for (const arg of args) {
          const argName = arg.required ? `<${arg.name()}>` : `[${arg.name()}]`

          output.push(formatArgument(argName, arg.description || ''))
        }
      }

      // Options
      const options = helper.visibleOptions(cmd)

      if (options.length > 0) {
        output.push(formatSectionTitle('Options'))

        for (const opt of options) {
          output.push(formatOption(opt.flags, opt.description))
        }
      }

      // Commands
      const commands = helper.visibleCommands(cmd)

      if (commands.length > 0) {
        output.push(formatSectionTitle('Commands'))

        for (const subCmd of commands) {
          output.push(formatCommand(subCmd.name(), subCmd.description()))
        }
      }

      // Footer
      output.push('')
      output.push(
        chalk.dim(
          `   Run ${chalk.cyan('bun forge <command> --help')} for more info on a specific command`
        )
      )
      output.push('')

      return output.join('\n')
    },

    subcommandTerm: cmd => chalk.cyan(cmd.name()),
    argumentTerm: arg =>
      chalk.magenta(arg.required ? `<${arg.name()}>` : `[${arg.name()}]`),
    optionTerm: opt => chalk.green(opt.flags)
  })

  // Custom error formatting
  program.configureOutput({
    outputError: str => {
      logger.error(str.trim())
    }
  })
}
