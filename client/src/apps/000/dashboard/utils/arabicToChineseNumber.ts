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

  chineseNumber = removeLeadingOne(chineseNumber, digits[1], units[1])
  chineseNumber = removeTrailingZero(chineseNumber)

  return chineseNumber
}

function getDigitMapping(format: 'simplified' | 'traditional'): string[] {
  return format === 'simplified'
    ? ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    : ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
}

function getUnitMapping(format: 'simplified' | 'traditional'): string[] {
  return format === 'simplified'
    ? ['', '十', '百', '千', '万', '十', '百', '千', '亿']
    : ['', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億']
}

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

function removeTrailingZero(chineseNumber: string): string {
  return chineseNumber.endsWith('零')
    ? chineseNumber.slice(0, -1)
    : chineseNumber
}
