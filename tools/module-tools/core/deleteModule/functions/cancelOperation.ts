import chalk from 'chalk'

function cancelOperation(t: (key: string) => string): void {
  console.log(
    chalk.red(`✖ ${t('moduleTools.features.delete.messages.cancelled')}`)
  )
  process.exit(0)
}

export default cancelOperation
