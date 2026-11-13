import { createServiceLogger } from '@functions/logging'
import { watch } from 'chokidar'

import { LANGUAGE_PACK_PATH, LocaleService } from './localeService'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const DEBOUNCE_MS = 500

const localeWatcherLogger = createServiceLogger('Core Locales Watcher')

/**
 * Watches core language packs and reloads them on change in production, where
 * no external process manager restarts the server after a locale pack is
 * installed, upgraded, or removed. `onReload` is invoked after the locales have
 * been reloaded so the caller can refresh state that depends on them.
 */
export function watchCoreLocales(onReload: () => void | Promise<void>): void {
  if (!IS_PRODUCTION) {
    return
  }

  let timer: NodeJS.Timeout | null = null

  const scheduleReload = (): void => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      timer = null

      LocaleService.validateAndLoad()

      Promise.resolve(onReload()).catch(error => {
        localeWatcherLogger.error(`Failed to reload server: ${error}`)
      })
    }, DEBOUNCE_MS)
  }

  const watcher = watch(LANGUAGE_PACK_PATH, {
    ignoreInitial: true,
    ignored: [/[\\/]\.git[\\/]/],
    awaitWriteFinish: {
      stabilityThreshold: 300,
      pollInterval: 100
    }
  })

  watcher.on('addDir', scheduleReload)
  watcher.on('unlinkDir', scheduleReload)
  watcher.on('add', scheduleReload)
  watcher.on('unlink', scheduleReload)
  watcher.on('change', scheduleReload)

  // Prevent watcher errors (e.g. transient EMFILE) from crashing the server.
  watcher.on('error', error => {
    localeWatcherLogger.error(`Core locales watcher error: ${error}`)
  })

  localeWatcherLogger.info('Watching core locales directory for changes')
}
