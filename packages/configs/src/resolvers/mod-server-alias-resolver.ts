import fs from 'node:fs'
import { builtinModules, createRequire } from 'node:module'
import path from 'node:path'
import { type Plugin } from 'vite'

const cjsRequire = createRequire(import.meta.url)

/**
 * Dynamically resolves the host api's package.json dependencies to build the external whitelist.
 */
function getCoreDependencies(dirname: string): Set<string> {
  const deps = new Set<string>()

  let currentDir = dirname

  while (currentDir !== path.dirname(currentDir)) {
    const apiPkgPath = path.join(currentDir, 'apps/api/package.json')

    if (fs.existsSync(apiPkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(apiPkgPath, 'utf8'))
        const allDeps = {
          ...pkg.dependencies,
          ...pkg.devDependencies
        }

        for (const dep of Object.keys(allDeps)) {
          deps.add(dep)
        }
        break
      } catch {
        // Ignore read/parse errors and fallback
      }
    }
    currentDir = path.dirname(currentDir)
  }

  return deps
}

/**
 * Node.js core built-in modules that are resolved without node: prefix.
 */
const NODE_BUILT_INS = new Set(builtinModules)

/**
 * Custom resolution plugin that intercepts bare module imports and marks them as external,
 * appending correct extensions to subpath imports. Fully respects custom path aliases,
 * virtual modules, Node built-ins, and query/hash URL suffixes.
 */
export function serverAliasResolver(dirname: string): Plugin {
  let aliases: any[] = []

  const coreDeps = getCoreDependencies(dirname)

  return {
    name: 'externalize-node-modules',
    enforce: 'pre',
    configResolved(config) {
      aliases = config.resolve.alias || []
    },
    resolveId(source) {
      // 1. Skip Vite virtual modules
      if (source.startsWith('\0') || source.startsWith('virtual:')) {
        return null
      }

      // 2. Unconditionally externalize native Node built-ins
      if (source.startsWith('node:')) {
        return { id: source, external: true }
      }

      // 3. Skip configured path aliases
      const isAlias = aliases.some(alias => {
        if (alias.find instanceof RegExp) {
          return alias.find.test(source)
        }

        return source === alias.find || source.startsWith(alias.find + '/')
      })

      if (isAlias) {
        return null
      }

      if (
        !source.startsWith('.') &&
        !source.startsWith('@/') &&
        source !== '@' &&
        !path.isAbsolute(source)
      ) {
        // 4. Handle query parameters and hashes (e.g. "pkg/subpath?query#hash")
        const queryIndex = source.indexOf('?')
        const hashIndex = source.indexOf('#')

        let cleanSource = source
        let suffix = ''

        if (queryIndex !== -1 || hashIndex !== -1) {
          const splitIndex =
            queryIndex !== -1 && hashIndex !== -1
              ? Math.min(queryIndex, hashIndex)
              : queryIndex !== -1
                ? queryIndex
                : hashIndex
          cleanSource = source.slice(0, splitIndex)
          suffix = source.slice(splitIndex)
        }

        // Extract the bare package name (e.g. "zod" or "@lifeforge/server-utils")
        const parts = cleanSource.split('/')
        const packageName = cleanSource.startsWith('@')
          ? parts.slice(0, 2).join('/')
          : parts[0]

        // 5. Determine if this package is a shared core dependency dynamically
        const isCoreExternal =
          packageName.startsWith('@lifeforge/') ||
          coreDeps.has(packageName) ||
          NODE_BUILT_INS.has(packageName)

        // If it is not a core package, return null to bundle it locally
        if (!isCoreExternal) {
          return null
        }

        // If it is a bare package import, externalize it as-is
        if (cleanSource === packageName) {
          return { id: source, external: true }
        }

        // It's a subpath import. Resolve it to find its real file extension.
        try {
          const resolvedPath = cjsRequire.resolve(cleanSource, {
            paths: [dirname]
          })

          // Normalize Windows backslashes to forward slashes
          const normalizedPath = resolvedPath.replace(/\\/g, '/')
          const ext = path.extname(normalizedPath)

          if (ext) {
            // Check if it resolved to an index file under a folder (e.g. ".../folder/index.js")
            const isIndexFile = normalizedPath.endsWith('/index' + ext)
            const cleanEndsWithIndex =
              cleanSource.endsWith('/index') ||
              cleanSource.endsWith('/index' + ext)

            if (isIndexFile && !cleanEndsWithIndex) {
              return {
                id: cleanSource + '/index' + ext + suffix,
                external: true
              }
            }

            if (!cleanSource.endsWith(ext)) {
              return { id: cleanSource + ext + suffix, external: true }
            }
          }
        } catch {
          // Fallback if resolution fails
        }

        return { id: source, external: true }
      }

      return null
    }
  }
}
