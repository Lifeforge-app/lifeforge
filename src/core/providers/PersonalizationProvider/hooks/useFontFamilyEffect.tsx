import { useEffect } from 'react'

import { IFontFamily } from '@modules/Personalization/components/FontFamilySelector'

function useFontFamily(fontFamily: string): void {
  useEffect(() => {
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?family=${fontFamily.replace(
        / /g,
        '+'
      )}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
    )
      .then(async res => {
        const data = (await res.json()) as {
          items: IFontFamily[]
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
      })
      .catch(err => {
        console.error(err)
      })
  }, [fontFamily])
}

export default useFontFamily
