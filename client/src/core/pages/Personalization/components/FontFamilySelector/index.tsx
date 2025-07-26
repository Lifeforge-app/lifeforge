import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { ConfigColumn } from 'lifeforge-ui'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import FontFamilyList from './components/FontFamilyList'

const addFontsToStylesheet = (fonts: any[]) => {
  const sheet = window.document.styleSheets[0]

  fonts.forEach(font => {
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
        sheet.insertRule(fontFaceRule, sheet.cssRules.length)
      } catch (err) {
        console.error('Failed to insert font rule:', fontFaceRule, err)
      }
    })
  })
}

function FontFamilySelector() {
  const { t } = useTranslation('core.personalization')

  const fontsQuery = useQuery(
    forgeAPI.user.personalization.listGoogleFonts.queryOptions()
  )

  useEffect(() => {
    if (fontsQuery.data) {
      addFontsToStylesheet(fontsQuery.data.items)
    }
  }, [fontsQuery.isSuccess])

  return (
    <ConfigColumn
      desc={t('fontFamily.desc')}
      hasDivider={false}
      icon="uil:font"
      title={t('fontFamily.title')}
      tooltip={
        <>
          <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
            <Icon className="size-5" icon="simple-icons:googlefonts" />
            {t('fontFamily.tooltipTitle')}
          </h3>
          <p className="text-bg-500 relative z-40 text-sm">
            {t('fontFamily.tooltip')}
          </p>
        </>
      }
    >
      <FontFamilyList fontsQuery={fontsQuery} />
    </ConfigColumn>
  )
}

export default FontFamilySelector
