import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import { ConfigColumn } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { fetchAPI } from 'shared/lib'

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
  const [enabled, setEnabled] = useState<'loading' | boolean>('loading')

  const { fontFamily, setFontFamily } = usePersonalization()
  const [allFonts, setAllFonts] = useState<any[]>([])

  useEffect(() => {
    const loadFonts = async () => {
      const fonts = await fetchAPI<{
        enabled: boolean
        items: any[]
      }>('/user/personalization/fonts')
      setEnabled(fonts.enabled)

      if (!fonts.enabled) {
        return
      }

      setAllFonts(fonts.items)
      addFontsToStylesheet(fonts.items)
    }

    loadFonts()
  }, [setAllFonts])

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
      <FontFamilyList
        allFonts={allFonts}
        enabled={enabled}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
      />
    </ConfigColumn>
  )
}

export default FontFamilySelector
