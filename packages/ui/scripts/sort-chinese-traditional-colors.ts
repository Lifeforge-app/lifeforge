import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CHINESE_TRADITIONAL_COLORS } from '../src/components/inputs/ColorInput/ColorPickerModal/components/modals/ChineseTraditionalColorsModal/constants/chinese_colors'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))

const dataPath = path.resolve(
  scriptDir,
  '../src/components/inputs/ColorInput/ColorPickerModal/components/modals/ChineseTraditionalColorsModal/constants/chinese_colors.ts'
)

function toLinear(channel: number) {
  return channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

function getLuminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function serializeEntries(colors: { name: string; value: string }[]) {
  return colors
    .map(({ name, value }, index) => {
      const isLast = index === colors.length - 1

      return `      {
        name: '${name.replaceAll("'", "\\'")}',
        value: '${value}'
      }${isLast ? '' : ','}`
    })
    .join('\n')
}

async function main() {
  let source = await readFile(dataPath, 'utf8')

  for (const { group, colors } of CHINESE_TRADITIONAL_COLORS) {
    const sortedColors = [...colors].sort(
      (a, b) => getLuminance(b.value) - getLuminance(a.value)
    )

    const groupPattern = new RegExp(
      `(group: '${group}',\\s*colors: \\[)[\\s\\S]*?(\\n\\s*\\])`
    )

    if (!groupPattern.test(source)) {
      throw new Error(`Could not find color group: ${group}`)
    }

    source = source.replace(
      groupPattern,
      `$1\n${serializeEntries(sortedColors)}$2`
    )
  }

  await writeFile(dataPath, source)

  console.log('Sorted color groups from light to dark.')
}

void main()
