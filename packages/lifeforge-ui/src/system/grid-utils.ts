export function normalizeGridTrack(
  value: string | number | undefined
): string | undefined {
  if (typeof value === 'number') {
    return `repeat(${value}, 1fr)`
  }

  return value
}

export function normalizeGridSpan(
  value: string | number | undefined
): string | undefined {
  if (typeof value === 'number') {
    return `span ${value}`
  }

  return value
}
