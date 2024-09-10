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
  // Define the mappings for digits and units in traditional and simplified Chinese
  const traditionalDigits = [
    '零',
    '壹',
    '贰',
    '叁',
    '肆',
    '伍',
    '陆',
    '柒',
    '捌',
    '玖'
  ]
  const traditionalUnits = ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億']
  const simplifiedDigits = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九'
  ]
  const simplifiedUnits = ['', '十', '百', '千', '万', '十', '百', '千', '亿']

  // Choose the correct mappings based on the format parameter
  const digits = format === 'simplified' ? simplifiedDigits : traditionalDigits
  const units = format === 'simplified' ? simplifiedUnits : traditionalUnits

  // Special case for 20 to 29 in simplified Chinese
  const specialTwenty = '廿'

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

    // Handle special case for 20 to 29 in simplified Chinese
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
  if (chineseNumber.startsWith(digits[1] + units[1])) {
    chineseNumber = chineseNumber.substring(1)
  }
  if (chineseNumber.endsWith('零')) {
    chineseNumber = chineseNumber.slice(0, -1)
  }

  return chineseNumber
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
