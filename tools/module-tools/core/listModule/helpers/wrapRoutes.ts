/* eslint-disable @typescript-eslint/strict-boolean-expressions */
function wrapRoutes(
  routes: Record<string, string>,
  maxLineLength = 40
): string {
  if (!routes) return 'No Routes'

  return Object.entries(routes)
    .map(([key, value]) => {
      const route = `${key}: ${value}`
      return route.length > maxLineLength
        ? route.slice(0, maxLineLength - 3) + '...'
        : route
    })
    .join('\n')
}

export default wrapRoutes
