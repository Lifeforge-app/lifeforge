import getProjectRootDir from './extractProjectRoot'

export default function getCallerModuleId():
  | { source: 'app' | 'core'; id: string }
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

    const projectRoot = getProjectRootDir(filePath)

    if (!projectRoot) continue

    const appMatch = filePath.match(
      new RegExp(`${projectRoot}\\/modules\\/([^/]+)\\/server\\/`)
    )

    if (appMatch) {
      return { source: 'app', id: appMatch[1] }
    }

    const coreMatch = filePath.match(
      new RegExp(
        `${projectRoot}\\/apps\\/api\\/src\\/(?:lib|core)\\/([^/]+)(?:\\/|$)`
      )
    )

    if (coreMatch) {
      return { source: 'core', id: coreMatch[1] }
    }
  }

  return undefined
}
