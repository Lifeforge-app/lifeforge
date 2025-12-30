import CLILoggingService from '@/utils/logging'

import SERVICES from '../constants/services'

/**
 * Validates if a service is valid
 */
export default function validateService(service: string): void {
  if (service && !SERVICES.includes(service)) {
    CLILoggingService.options(`Invalid service: "${service}"`, [...SERVICES])
    process.exit(1)
  }
}
