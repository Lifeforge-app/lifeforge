import { watch } from 'chokidar'

import { loaderLogger } from './logger'

const DEBOUNCE_MS = 500

/**
 * Watches `modulesDir` and invokes `onReload` (debounced) whenever modules are
 * installed, removed, or changed on disk. Returns a disposer that stops the
 * watcher.
 */
export function watchModules(
  modulesDir: string,
  onReload: () => void | Promise<void>
): () => void {
  let timer: NodeJS.Timeout | null = null

  const scheduleReload = (): void => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = null

      Promise.resolve(onReload()).catch(error => {
        loaderLogger.error(`Failed to reload modules: ${error}`)
      })
    }, DEBOUNCE_MS)
  }

  const watcher = watch(modulesDir, {
    ignoreInitial: true,
    // Never descend into per-module dependencies or dot-directories (git data,
    // caches such as `.cache`); watching those exhausts file descriptors
    // (EMFILE).
    ignored: [
      /[\\/]node_modules[\\/]/,
      /[\\/]\.[^\\/]+[\\/]/,
      /[\\/]\.[^\\/]+$/
    ],
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  })

  watcher.on('addDir', scheduleReload)
  watcher.on('unlinkDir', scheduleReload)
  watcher.on('add', scheduleReload)
  watcher.on('unlink', scheduleReload)

  // Prevent watcher errors (e.g. transient EMFILE) from crashing the server.
  watcher.on('error', error => {
    loaderLogger.error(`Modules watcher error: ${error}`)
  })

  loaderLogger.info('Watching modules directory for changes')

  return () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    watcher.close()
  }
}
