import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigColumn } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import FontFamilyItem from './components/FontFamilyItem'

export interface IFontFamily {
  family: string
  variants: string[]
  subsets: string[]
  version: string
  lastModified: Date
  files: Record<string, string>
  category: Category
  kind: Kind
  menu: string
  colorCapabilities?: ColorCapability[]
}

enum Category {
  Display = 'display',
  Handwriting = 'handwriting',
  Monospace = 'monospace',
  SansSerif = 'sans-serif',
  Serif = 'serif'
}

enum ColorCapability {
  COLRv0 = 'COLRv0',
  COLRv1 = 'COLRv1',
  SVG = 'SVG'
}

export enum Kind {
  WebfontsWebfont = 'webfonts#webfont'
}

const GOOGLE_FONTS_API_URL =
  'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyACIfnP46cNm8nP9HaMafF0hwI9X0hyyg4'

const fetchFonts = async () => {
  try {
    const response = await fetch(GOOGLE_FONTS_API_URL)
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching Google Fonts:', error)
    return []
  }
}

const addFontsToStylesheet = (fonts: IFontFamily[]) => {
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

function FontFamilySelector(): React.ReactElement {
  const { componentBgWithHover } = useComponentBg()
  const { fontFamily, setFontFamily } = usePersonalizationContext()
  const [allFonts, setAllFonts] = useState<IFontFamily[]>([])
  const { t } = useTranslation('modules.personalization')

  useEffect(() => {
    const loadFonts = async () => {
      const fonts = await fetchFonts()
      setAllFonts(fonts)
      addFontsToStylesheet(fonts)
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
      <Listbox
        value={fontFamily}
        onChange={font => {
          setFontFamily(font)
        }}
      >
        <div className="relative mt-1 w-full md:w-64">
          <ListboxButton
            className={clsx(
              'shadow-custom outline-hidden focus:outline-hidden flex w-full items-center gap-2 rounded-lg py-4 pl-4 pr-10 text-left transition-all',
              componentBgWithHover
            )}
          >
            <span
              className="-mt-px block truncate"
              style={{
                fontFamily
              }}
            >
              {fontFamily || (
                <span className="text-bg-500">
                  {t('fontFamily.pleaseSelect')}
                </span>
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="divide-bg-200 bg-bg-100 text-bg-800 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 h-72 w-80 divide-y rounded-md py-1 text-base shadow-lg transition duration-100 ease-out [--anchor-gap:8px]"
          >
            {allFonts.map(({ family }) => (
              <FontFamilyItem key={family} family={family} />
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </ConfigColumn>
  )
}

export default FontFamilySelector
