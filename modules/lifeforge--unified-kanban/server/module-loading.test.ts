import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Unified Kanban server loading', () => {
  it('loads through the API development route loader', () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..')
    const moduleDir = path.join(repoRoot, 'modules/lifeforge--unified-kanban')
    expect(() =>
      execFileSync(
        'pnpm',
        [
          'exec',
          'tsx',
          '--tsconfig',
          path.join(moduleDir, 'server/tsconfig.json'),
          path.join(moduleDir, 'server/index.ts')
        ],
        {
          cwd: moduleDir,
          env: { ...process.env, NODE_ENV: 'development' },
          encoding: 'utf8'
        }
      )
    ).not.toThrow()
  })

  it('loads the production bundle without module-only packages', () => {
    const repoRoot = path.resolve(import.meta.dirname, '../../..')
    const moduleDir = path.join(repoRoot, 'modules/lifeforge--unified-kanban')
    const serverDir = path.join(moduleDir, 'server')

    execFileSync(
      'pnpm',
      [
        'exec',
        'vite',
        'build',
        '--config',
        path.join(serverDir, 'vite.config.ts')
      ],
      { cwd: moduleDir, stdio: 'ignore' }
    )

    const dependencyBlocker = `data:text/javascript,${encodeURIComponent(`export function resolve(specifier, context, nextResolve) { if (specifier.startsWith('@nestjs/') || specifier === 'reflect-metadata') throw new Error('module-only dependency was externalized'); return nextResolve(specifier, context); }`)}`

    expect(() =>
      execFileSync(
        'node',
        [
          '--experimental-loader',
          dependencyBlocker,
          path.join(serverDir, 'dist/index.js')
        ],
        { cwd: repoRoot, stdio: 'ignore' }
      )
    ).not.toThrow()
  })
})
