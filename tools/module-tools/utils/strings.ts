function toCamelCase(str: string): string {
  const camelCase = str
    .replace(/\s(.)/g, $1 => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase())

  return camelCase[0].toUpperCase() + camelCase.slice(1)
}

function toDashCase(str: string): string {
  return str.toLowerCase().replace(/\s/g, '-')
}

export { toCamelCase, toDashCase }
