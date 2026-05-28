export function escapeCssClassName(name: string): string {
  if (/^\d/.test(name)) {
    return `\\3${name[0]} ${name.slice(1)}`
  }

  return name
}
