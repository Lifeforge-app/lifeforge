import logger from './logger'

/** Converts a string to dash-case (kebab-case). */
export function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

/** Whether a string is dash-case (kebab-case). */
export function isKebabCase(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

/** Ensures a `owner/repo` slug's repo name is dash-case, exiting otherwise. */
export function assertKebabRepo(repo: string): void {
  const name = repo.split('/').pop() ?? repo

  if (!isKebabCase(name)) {
    logger.error(
      `Repository name "${name}" must be dash-case (e.g. "lifeforge-module-my-module"). Please rename the GitHub repo.`
    )

    process.exit(1)
  }
}
