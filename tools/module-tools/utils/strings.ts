/* eslint-disable no-control-regex */
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

function getVisibleLength(rawText: string): number {
  // Regular expression to remove ANSI escape codes
  const cleanedText = rawText.replace(/\u001b\[.*?m/g, '')
  return cleanedText.length
}

export { toCamelCase, toDashCase, getVisibleLength }
