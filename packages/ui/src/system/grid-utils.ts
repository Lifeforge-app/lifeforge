export function normalizeGridTrack(value: number | string): string {
  if (typeof value === 'number') {
    return `repeat(${value}, 1fr)`
  }

  return value
}

export function normalizeGridSpan(value: number | string): string {
  if (typeof value === 'number') {
    return `span ${value}`
  }

  return value
}
