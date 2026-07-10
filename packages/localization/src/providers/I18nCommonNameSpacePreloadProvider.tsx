import type React from 'react'
import { getI18n } from 'react-i18next'

export function I18nCommonNameSpacePreloadProvider({
  children
}: {
  children: React.ReactNode
}) {
  const i18n = getI18n()

  i18n.on('loaded', () => {
    const loadedLangs = i18n.languages || ['en']

    for (const lang of loadedLangs) {
      const commonBundle = i18n.getResourceBundle(lang, 'common') as
        | Record<string, unknown>
        | undefined

      if (commonBundle) {
        const subnamespaces = Object.keys(commonBundle)

        for (const sub of subnamespaces) {
          if (i18n.hasResourceBundle(lang, `common.${sub}`)) {
            return
          }

          i18n.addResourceBundle(
            lang,
            `common.${sub}`,
            (commonBundle[sub] as Record<string, unknown>) || {},
            true,
            true
          )
        }
      }
    }
  })

  return children
}
