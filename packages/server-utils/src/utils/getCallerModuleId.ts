import { ModuleRegistry } from '../registry/ModuleRegistry'

export default function getCallerModuleId():
  | {
      source: 'app' | 'core'
      id: string
    }
  | undefined {
  const obj: { stack?: string } = {}

  Error.captureStackTrace(obj)

  const lines = obj.stack?.split('\n') || []

  for (let i = 2; i < lines.length; i++) {
    const line = lines[i]

    if (
      !line.includes('/apps/api/src/lib/') &&
      !line.includes('/apps/api/src/core/') &&
      !line.includes('/modules/')
    ) {
      continue
    }

    const pathMatch =
      line.match(/\((.+):\d+:\d+\)/) || line.match(/at (.+):\d+:\d+/)

    const filePath = pathMatch?.[1]

    if (!filePath) continue

    const registeredCaller = ModuleRegistry.getModuleByPath(filePath)

    if (registeredCaller) {
      registeredCaller.id = registeredCaller.id.replace(/^@lifeforge\//, '')

      return registeredCaller
    }

    const coreMatch = filePath.match(
      /\/apps\/api\/src\/(?:lib|core)\/([^/]+)(?:\/|$)/
    )

    if (coreMatch) {
      return { source: 'core', id: coreMatch[1] }
    }
  }

  return undefined
}
