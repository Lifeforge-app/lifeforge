import fs from 'fs'
import semver from 'semver'

/**
 * Bumps the patch version in a module's package.json file.
 *
 * Reads the current version, increments the patch number using semver,
 * and writes the updated version back to package.json.
 *
 * @param packagePath - The absolute path to the module directory
 * @returns An object containing the old and new version strings
 */
export default function bumpPackageVersion(packagePath: string): {
  oldVersion: string
  newVersion: string
} {
  const pkgPath = `${packagePath}/package.json`

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  const oldVersion = pkg.version

  const newVersion = semver.inc(oldVersion, 'patch') || oldVersion

  pkg.version = newVersion
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  return { oldVersion, newVersion }
}

/**
 * Reverts the version in a module's package.json file to a previous value.
 *
 * Used for rollback when a publish operation fails after version bump.
 *
 * @param packagePath - The absolute path to the module directory
 * @param version - The version string to revert to
 */
export function revertPackageVersion(
  packagePath: string,
  version: string
): void {
  const pkgPath = `${packagePath}/package.json`

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}
