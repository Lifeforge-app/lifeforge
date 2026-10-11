import { log, spinner } from '@clack/prompts'

type SpinnerInstance = ReturnType<typeof spinner>

/**
 * A single-active-spinner manager. clack only supports one spinner at a time,
 * and long operations here can nest (install → download → install deps), so the
 * manager tracks a stack of messages: nested calls update the message of the
 * existing spinner instead of starting a new one, and only the outermost stop
 * actually stops it. Falls back to plain `log` output when stdout is not a TTY.
 */
let active: SpinnerInstance | null = null

const messages: string[] = []

export function startSpinner(message: string): void {
  messages.push(message)

  if (!process.stdout.isTTY) {
    return
  }

  if (active) {
    active.message(message)

    return
  }

  active = spinner()
  active.start(message)
}

export function updateSpinner(message: string): void {
  if (messages.length > 0) {
    messages[messages.length - 1] = message
  }

  active?.message(message)
}

export function stopSpinner(message?: string): void {
  messages.pop()

  if (message && messages.length > 0) {
    messages[messages.length - 1] = message
  }

  if (!process.stdout.isTTY) {
    if (message && messages.length === 0) {
      log.success(message)
    }

    return
  }

  if (!active) {
    return
  }

  if (messages.length === 0) {
    active.stop(message)
    active = null
  } else {
    active.message(messages[messages.length - 1] ?? message ?? '')
  }
}

export function failSpinner(message?: string): void {
  // Unwind the spinner stack on failure.
  messages.length = 0

  if (!process.stdout.isTTY) {
    if (message) {
      log.error(message)
    }

    return
  }

  if (active) {
    active.error(message)
    active = null
  } else if (message) {
    log.error(message)
  }
}

/**
 * Runs `fn` behind a spinner, showing `success`/`fail` when it settles.
 * `fn` must not emit its own `log.*` output while running.
 */
export async function withSpinner<T>(
  message: string,
  fn: () => Promise<T> | T,
  options?: { success?: string; fail?: string }
): Promise<T> {
  startSpinner(message)

  try {
    const result = await fn()

    stopSpinner(options?.success)

    return result
  } catch (error) {
    failSpinner(options?.fail)

    throw error
  }
}
