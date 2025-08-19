import _ from 'lodash'

import type { ModuleConfig } from '../interfaces/routes_interfaces'

/**
 * Determines if a module should be enabled based on user preferences and configuration
 */
export function shouldModuleBeEnabled(
  item: ModuleConfig,
  enabledModules: string[]
): boolean {
  // If the module is force disabled, it should never be enabled
  if (item.forceDisable) {
    return false
  }

  // If the module is not togglable, it's always enabled
  if (!item.togglable) {
    return true
  }

  // For togglable modules, check if it's in the enabled modules list
  const moduleKey = _.kebabCase(item.name)

  return enabledModules.includes(moduleKey)
}

/**
 * Filters modules based on visibility and enablement rules
 */
export function getEnabledModules(
  items: ModuleConfig[],
  enabledModules: string[]
): ModuleConfig[] {
  return items.filter(
    item => !item.hidden && shouldModuleBeEnabled(item, enabledModules)
  )
}
