/* eslint-disable react-compiler/react-compiler */
import { useEffect } from 'react'

import fetchAPI from '../../../utils/fetchAPI'
import { useAPIEndpoint } from '../../APIEndpointProvider'

function useFontFamily(
  rootElement: HTMLElement,
  fontFamily: string,
  fontScale: number
) {
  const apiEndpoint = useAPIEndpoint()

  useEffect(() => {
    const styleTagId = 'dynamic-font-style'

    let styleTag = document.getElementById(
      styleTagId
    ) as HTMLStyleElement | null

    if (styleTag) {
      styleTag.remove()
    }

    styleTag = document.createElement('style')
    styleTag.id = styleTagId
    document.head.appendChild(styleTag)

    async function updateFontFamily() {
      try {
        const data = await fetchAPI<{ enabled: boolean; items: any[] }>(
          apiEndpoint,
          `/user/personalization/getGoogleFont?family=${fontFamily.replace(/ /g, '+')}`
        )

        if (!data.enabled) {
          rootElement.style.fontFamily = 'Onest, sans-serif'

          return
        }

        let css = ''

        if (data.items) {
          data.items.forEach(font => {
            Object.entries(font.files).forEach(([variant, url]) => {
              const fontFace = `@font-face {
                font-family: "${font.family}";
                src: url('${url}');
                ${
                  !['regular', 'italic'].includes(variant)
                    ? `font-weight: ${variant.replace('italic', '')};`
                    : ''
                }
                font-style: ${variant.includes('italic') ? 'italic' : 'normal'};
                font-display: swap;
              }`

              css += fontFace + '\n'
            })
            rootElement.style.fontFamily = `"${font.family}", sans-serif`
          })
        }

        styleTag!.textContent = css
      } catch {
        rootElement.style.fontFamily = 'Onest, sans-serif'
        console.error('Failed to update font family')
      }
    }

    updateFontFamily()

    return () => {
      styleTag?.remove()
    }
  }, [fontFamily])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--custom-font-scale',
      `${fontScale}`
    )
  }, [fontScale])
}

export default useFontFamily
