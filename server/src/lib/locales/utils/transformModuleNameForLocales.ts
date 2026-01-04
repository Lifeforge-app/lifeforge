import _ from 'lodash'

/**
 * Transforms a module name for locale engine compatibility
 *
 * `[moduleauthor]--[module-name] -> [moduleauthor]__[module-name]`
 *
 * If the module author is lifeforge, the moduleauthor will be removed.
 *
 * @example ```plaintext
 * lifeforge--calendar -> calendar
 * ```
 *
 * @example ```plaintext
 * melvinchia3636--invoice-maker -> melvinchia3636__invoiceMaker
 * ```
 *
 * @param moduleName
 */
export default function transformModuleNameForLocales(moduleName: string) {
  if (moduleName.includes('--')) {
    const [username, name] = moduleName.split('--')

    if (username === 'lifeforge') {
      moduleName = _.camelCase(name)
    } else {
      moduleName = `${username}__${_.camelCase(name)}`
    }
  }

  return moduleName
}
