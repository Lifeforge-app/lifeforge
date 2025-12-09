import { useEffect, useRef } from 'react'

import fetchAPI from '../../../utils/fetchAPI'
import { useAPIEndpoint } from '../../APIEndpointProvider'

interface CustomFontData {
  id: string
  displayName: string
  family: string
  weight: number
  file: string
  collectionId: string
}

function useFontFamily(fontFamily: string, fontScale: number, forgeAPI: any) {
  const apiEndpoint = useAPIEndpoint()

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const styleTagId = 'dynamic-font-style'

    // Get or create the style tag (don't remove existing one to avoid flicker)
    let styleTag = document.getElementById(
      styleTagId
    ) as HTMLStyleElement | null

    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = styleTagId
      document.head.appendChild(styleTag)
    }

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    const currentController = abortControllerRef.current

    async function updateFontFamily() {
      try {
        // Check if this is a custom font (identified by 'custom:' prefix)
        if (fontFamily.startsWith('custom:')) {
          // Guard: ensure forgeAPI is available before making custom font requests
          if (!forgeAPI?.user?.customFonts?.get) {
            console.warn(
              'forgeAPI.user.customFonts.get not available yet for custom font loading'
            )

            return
          }

          const customFontId = fontFamily.replace('custom:', '')

          const fontData: CustomFontData = await forgeAPI.user.customFonts.get
            .input({
              id: customFontId
            })
            .query()

          // Check if this request was aborted
          if (currentController.signal.aborted) {
            return
          }

          // Construct the PocketBase file URL
          const fileUrl = forgeAPI.media.input({
            collectionId: fontData.collectionId,
            recordId: fontData.id,
            fieldId: fontData.file
          }).endpoint

          // Create @font-face rule for the custom font
          const fontFace = `@font-face {
            font-family: "${fontData.family}";
            src: url('${fileUrl}');
            font-weight: ${fontData.weight};
            font-style: normal;
            font-display: swap;
          }`

          styleTag!.textContent = fontFace

          document.body.style.fontFamily = `"${fontData.family}", sans-serif`

          return
        }

        // Handle Google Fonts (original logic)
        const data = await fetchAPI<{ enabled: boolean; items: any[] }>(
          apiEndpoint,
          `/user/personalization/getGoogleFont?family=${fontFamily.replace(/ /g, '+')}`
        )

        // Check if this request was aborted
        if (currentController.signal.aborted) {
          return
        }

        if (!data.enabled) {
          document.body.style.fontFamily = 'Onest, sans-serif'

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
            document.body.style.fontFamily = `"${font.family}", sans-serif`
          })
        }

        styleTag!.textContent = css
      } catch (error) {
        // Only log error and apply fallback if not aborted
        if (!currentController.signal.aborted) {
          document.body.style.fontFamily = 'Onest, sans-serif'
          console.error('Failed to update font family:', error)
        }
      }
    }

    updateFontFamily()

    return () => {
      currentController.abort()
      // Don't remove style tag on cleanup to avoid flicker during re-renders
    }
  }, [fontFamily, forgeAPI, apiEndpoint])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--custom-font-scale',
      `${fontScale}`
    )
  }, [fontScale])
}

export default useFontFamily
