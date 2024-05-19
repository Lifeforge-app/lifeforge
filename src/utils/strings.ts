export function titleToPath(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function toCamelCase(str: string): string {
  return str
    .replace(/\s(.)/g, $1 => $1.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, $1 => $1.toLowerCase())
    .replace(/[^\w ]+/g, '')
}

export function shortenBigNumber(num: number): string {
  if (num < 1e3) return num.toString()
  if (num >= 1e3 && num < 1e6) return (num / 1e3).toFixed(1) + 'K'
  if (num >= 1e6 && num < 1e9) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e9 && num < 1e12) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
  return num.toString()
}
