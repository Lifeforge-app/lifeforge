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

export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export function camelCaseToTitleCase(text: string): string {
  return text
    ?.replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

export function shortenBigNumber(num: number): string {
  if (num < 1e3) return num.toString()
  if (num >= 1e3 && num < 1e6) return (num / 1e3).toFixed(1) + 'K'
  if (num >= 1e6 && num < 1e9) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e9 && num < 1e12) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
  return num.toString()
}

export function numberToMoney(
  number: number,
  currency: string = 'MYR'
): string {
  return parseFloat(number.toFixed(2)) !== 0
    ? Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        currencyDisplay: 'code'
      })
        .format(number)
        .replace(currency, '')
        .trim()
    : '0.00'
}

export function arabicToTraditionalFormalChinese(number: number): string {
  // Define the mappings for digits and units in traditional formal Chinese
  const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const units = ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億']

  // Convert the number to a string to iterate through it
  const numStr = number.toString()

  // Initialize the result list
  const result = []

  // Get the length of the number
  const length = numStr.length

  for (let i = 0; i < length; i++) {
    // Convert the digit to its corresponding Chinese character
    const digit = parseInt(numStr.charAt(i))
    const chineseDigit = digits[digit]

    // Determine the position in the number
    const unitIndex = length - i - 1

    // Add the Chinese digit and the unit
    if (
      chineseDigit !== '零' ||
      (unitIndex % 4 === 0 && chineseDigit === '零')
    ) {
      result.push(chineseDigit)
      if (unitIndex > 0) {
        result.push(units[unitIndex])
      }
    } else if (chineseDigit === '零') {
      // Avoid adding multiple consecutive '零'
      if (result.length === 0 || result[result.length - 1] !== '零') {
        result.push('零')
      }
    }
  }

  // Join the result list into a string
  let chineseNumber = result.join('')

  // Handle special cases for tens
  if (chineseNumber.startsWith('壹拾')) {
    chineseNumber = chineseNumber.substring(1)
  }
  if (chineseNumber.endsWith('零')) {
    chineseNumber = chineseNumber.slice(0, -1)
  }

  return chineseNumber
}

export function arabicToChinese(
  number: string,
  format: 'simplified' | 'traditional' = 'traditional'
): string {
  const digits = getDigitMapping(format)
  const units = getUnitMapping(format)
  const specialTwenty = '廿'

  let chineseNumber = convertNumberToChinese(
    number,
    digits,
    units,
    format,
    specialTwenty
  )

  // Handle special cases for tens
  chineseNumber = removeLeadingOne(chineseNumber, digits[1], units[1])
  chineseNumber = removeTrailingZero(chineseNumber)

  return chineseNumber
}

// Helper to get digit mappings based on format
function getDigitMapping(format: 'simplified' | 'traditional'): string[] {
  return format === 'simplified'
    ? ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    : ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
}

// Helper to get unit mappings based on format
function getUnitMapping(format: 'simplified' | 'traditional'): string[] {
  return format === 'simplified'
    ? ['', '十', '百', '千', '万', '十', '百', '千', '亿']
    : ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億']
}

// Helper function to convert number to Chinese format
function convertNumberToChinese(
  numStr: string,
  digits: string[],
  units: string[],
  format: 'simplified' | 'traditional',
  specialTwenty: string
): string {
  const result: string[] = []
  const length = numStr.length

  for (let i = 0; i < length; i++) {
    const digit = parseInt(numStr.charAt(i))
    const chineseDigit = digits[digit]
    const unitIndex = length - i - 1

    if (
      format === 'simplified' &&
      unitIndex === 1 &&
      digit === 2 &&
      length === 2
    ) {
      result.push(specialTwenty)
    } else if (
      chineseDigit !== '零' ||
      (unitIndex % 4 === 0 && chineseDigit === '零')
    ) {
      result.push(chineseDigit)
      if (unitIndex > 0) result.push(units[unitIndex])
    } else if (
      chineseDigit === '零' &&
      (result.length === 0 || result[result.length - 1] !== '零')
    ) {
      result.push('零')
    }
  }

  return result.join('')
}

// Remove leading 'one' for tens place
function removeLeadingOne(
  chineseNumber: string,
  one: string,
  ten: string
): string {
  if (chineseNumber.startsWith(one + ten)) {
    return chineseNumber.substring(1)
  }
  return chineseNumber
}

// Remove trailing zero
function removeTrailingZero(chineseNumber: string): string {
  return chineseNumber.endsWith('零')
    ? chineseNumber.slice(0, -1)
    : chineseNumber
}

export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function cleanFileSize(byte: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (byte === 0) return '0 Byte'
  const i = Math.floor(Math.log(byte) / Math.log(1024))
  return Math.round(byte / Math.pow(1024, i)) + ' ' + sizes[i]
}

export function addNumberSuffix(number: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const v = number % 100
  return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0])
}
