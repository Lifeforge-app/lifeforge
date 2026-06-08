import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createLogger } from '../logger'

vi.mock('../transports/file', () => ({
  getFileStream: () => ({
    write: vi.fn()
  })
}))

describe('createLogger', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleSpy = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true)
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('creates a logger with the specified name', () => {
    const log = createLogger({ name: 'TestLogger' })

    expect(log).toBeDefined()
    expect(log.info).toBeInstanceOf(Function)
    expect(log.error).toBeInstanceOf(Function)
    expect(log.warn).toBeInstanceOf(Function)
    expect(log.debug).toBeInstanceOf(Function)
    expect(log.fatal).toBeInstanceOf(Function)
  })

  it('supports child loggers', () => {
    const log = createLogger({ name: 'Parent' })

    const child = log.child({ service: 'DB' })

    expect(child).toBeDefined()
    expect(child.info).toBeInstanceOf(Function)
  })

  it('logs info messages', () => {
    const log = createLogger({ name: 'Test', pretty: false })

    log.info('Test message')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('logs with metadata', () => {
    const log = createLogger({ name: 'Test', pretty: false })

    log.info('Test message', { key: 'value' })
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('respects log level filtering', () => {
    const log = createLogger({ name: 'Test', level: 'error', pretty: false })

    log.debug('Debug message')
    log.error('Error message')

    const calls = consoleSpy.mock.calls.filter(call =>
      call[0]?.toString().includes('Error message')
    )

    expect(calls.length).toBeGreaterThan(0)
  })
})
