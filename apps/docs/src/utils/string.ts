export function toLinkCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function toTitleCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[\s_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}
