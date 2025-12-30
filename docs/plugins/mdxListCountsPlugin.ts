import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const VIRTUAL_MODULE_ID = 'virtual:mdx-list-counts'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

function countListItems(mdxSource: string): number {
  const listItemRegex = /^[\t ]*- /gm
  const matches = mdxSource.match(listItemRegex)
  return matches ? matches.length : 0
}

function mdxListCountsPlugin(): Plugin {
  return {
    name: 'vite-plugin-mdx-list-counts',
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },
    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const versionsDir = path.resolve(
          __dirname,
          '../src/contents/04.progress/versions'
        )
        const counts: Record<string, number> = {}

        // Read all MDX files recursively
        function readMdxFiles(dir: string, basePath = '') {
          const entries = fs.readdirSync(dir, { withFileTypes: true })

          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name)
            const relativePath = path.join(basePath, entry.name)

            if (entry.isDirectory()) {
              readMdxFiles(fullPath, relativePath)
            } else if (entry.name.endsWith('.mdx')) {
              const content = fs.readFileSync(fullPath, 'utf-8')
              const key = `../versions/${relativePath.replace(/\\/g, '/')}`
              counts[key] = countListItems(content)
            }
          }
        }

        readMdxFiles(versionsDir)

        return `export default ${JSON.stringify(counts)};`
      }
    },
    handleHotUpdate({ file, server }) {
      // Invalidate the virtual module when any MDX file changes
      if (file.endsWith('.mdx') && file.includes('versions')) {
        const module = server.moduleGraph.getModuleById(
          RESOLVED_VIRTUAL_MODULE_ID
        )
        if (module) {
          server.moduleGraph.invalidateModule(module)
          return [module]
        }
      }
    }
  }
}

export default mdxListCountsPlugin
