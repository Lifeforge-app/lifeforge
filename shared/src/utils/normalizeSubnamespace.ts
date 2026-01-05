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
export default function normalizeSubnamespace(moduleName: string) {
  if (!moduleName.includes('$') && !moduleName.includes('--')) {
    return _.camelCase(moduleName)
  }

  const [username, name] = moduleName.split(/\$|--/)

  if (username === 'lifeforge') {
    return _.camelCase(name)
  }

  return `${username}__${_.camelCase(name)}`
}
