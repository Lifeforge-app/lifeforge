import type { FontFamily } from '../components/FontFamilySelectorModal/tabs/GoogleFontSelector'

const fontRuleMap = new Map<string, number[]>()

const addFontToStylesheet = (font: FontFamily) => {
  const sheet = window.document.styleSheets[0]

  const ruleIndices: number[] = []

  Object.entries(font.files).forEach(([variant, url]) => {
    if (!['regular', '500'].includes(variant) || variant.includes('italic')) {
      return
    }

    const fontFaceRule = `
      @font-face {
        font-family: '${font.family}';
        src: url('${url}');
        ${
          !['regular', 'italic'].includes(variant)
            ? `font-weight: ${variant};`
            : ''
        }
        font-style: ${variant.includes('italic') ? 'italic' : 'normal'};
        font-display: swap;
      }
    `

    try {
      const ruleIndex = sheet.cssRules.length

      sheet.insertRule(fontFaceRule, ruleIndex)
      ruleIndices.push(ruleIndex)
    } catch (err) {
      console.error('Failed to insert font rule:', fontFaceRule, err)
    }
  })

  if (ruleIndices.length > 0) {
    fontRuleMap.set(font.family, ruleIndices)
  }
}

const removeFontFromStylesheet = (fontFamily: string) => {
  const ruleIndices = fontRuleMap.get(fontFamily)

  if (!ruleIndices) return

  const sheet = window.document.styleSheets[0]

  ruleIndices
    .sort((a, b) => b - a)
    .forEach(ruleIndex => {
      try {
        if (ruleIndex < sheet.cssRules.length) {
          sheet.deleteRule(ruleIndex)
        }
      } catch (err) {
        console.error('Failed to remove font rule at index:', ruleIndex, err)
      }
    })

  fontRuleMap.delete(fontFamily)

  fontRuleMap.forEach((indices, family) => {
    const updatedIndices = indices.map(index => {
      const removedBefore = ruleIndices.filter(
        removedIndex => removedIndex < index
      ).length

      return index - removedBefore
    })

    fontRuleMap.set(family, updatedIndices)
  })
}

export { addFontToStylesheet, removeFontFromStylesheet }
