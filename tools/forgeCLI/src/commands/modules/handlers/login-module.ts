import { confirmAction } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import {
  checkAuth,
  getRegistryUrl,
  openRegistryLogin
} from '../../../utils/registry'

export async function loginModuleHandler(): Promise<void> {
  CLILoggingService.progress('Checking registry authentication...')

  const auth = await checkAuth()

  if (auth.authenticated && auth.username) {
    CLILoggingService.success(`Already authenticated as ${auth.username}`)

    const reLogin = await confirmAction('Would you like to login again?')

    if (!reLogin) {
      return
    }
  }

  CLILoggingService.info('Opening registry login page...')

  openRegistryLogin()

  const registry = getRegistryUrl()

  CLILoggingService.info('Please follow these steps to complete login:')
  CLILoggingService.info('1. Log in with GitHub on the registry page')
  CLILoggingService.info('2. Copy your token from the registry UI')
  CLILoggingService.info('3. Run the following command:')
  CLILoggingService.info(
    `npm config set //${registry.replace('http://', '').replace(/\/$/, '')}/:_authToken "YOUR_TOKEN"`
  )
}
