import { useEffect } from 'react'

import fetchAPI from '@utils/fetchAPI'

function useFontFamily(fontFamily: string) {
  async function updateFontFamily() {
    try {
      const data = await fetchAPI<{ enabled: boolean; items: any[] }>(
        `/user/personalization/font?family=${fontFamily.replace(/ /g, '+')}`
      )

      if (!data.enabled) {
        document.body.style.fontFamily = 'Onest, sans-serif'
        return
      }

      if (data.items) {
        const sheet = window.document.styleSheets[0]

        data.items.forEach(font => {
          Object.entries(font.files).forEach(([variant, url]) => {
            const fontFace = `@font-face {
              font-family: '${font.family}';
              src: url('${url}');
              ${
                !['regular', 'italic'].includes(variant)
                  ? `font-weight: ${variant.replace('italic', '')};`
                  : ''
              }
              font-style: ${variant.includes('italic') ? 'italic' : 'normal'};
              font-display: swap;
            }`

            try {
              sheet.insertRule(fontFace, sheet.cssRules.length)
            } catch (err) {
              console.error(fontFace)
              console.error(err)
            }

            document.body.style.fontFamily = `${font.family}, sans-serif`
          })
        })
      }
    } catch {
      document.body.style.fontFamily = 'Onest, sans-serif'
      console.error('Failed to update font family')
    }
  }

  useEffect(() => {
    updateFontFamily()
  }, [fontFamily])
}

export default useFontFamily
