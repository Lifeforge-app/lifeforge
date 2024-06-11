/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export function titleToPath(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function toCamelCase(str: string): string {
  if (!str) return ''

  return str
    .toLowerCase()
    .replace(/\s{2,}/g, ' ')
    .replace(/\s(.)/g, $1 => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase())
}

export function camelToDashCase(str: string): string {
  // Convert camelCase to dash-case
  return str
    .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

export function stringToDashCase(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

export function convertToDashCase(str: string): string {
  // Check if string is camelCase
  if (str === toCamelCase(str)) {
    return camelToDashCase(str)
  } else {
    return stringToDashCase(str)
  }
}

export function shortenBigNumber(num: number): string {
  if (num < 1e3) return num.toString()
  if (num >= 1e3 && num < 1e6) return (num / 1e3).toFixed(1) + 'K'
  if (num >= 1e6 && num < 1e9) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e9 && num < 1e12) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
  return num.toString()
}

export function numberToMoney(number: number): string {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
}
