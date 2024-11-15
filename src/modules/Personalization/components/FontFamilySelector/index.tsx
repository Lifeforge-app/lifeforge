/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
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

function FontFamilySelector(): React.ReactElement {
  const { fontFamily, setFontFamily } = usePersonalizationContext()
  const [allFonts, setAllFonts] = useState<IFontFamily[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    fetch(
      'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyACIfnP46cNm8nP9HaMafF0hwI9X0hyyg4'
    )
      .then(async res => await res.json())
      .then(data => {
        setAllFonts(data.items)

        const sheet = window.document.styleSheets[0]

        data.items.forEach((font: IFontFamily) => {
          Object.entries(font.files).forEach(([variant, url]) => {
            if (
              !['regular', '500'].includes(variant) ||
              variant.includes('italic')
            ) {
              return
            }

            const fontFace = `@font-face {
                font-family: '${font.family}';
                src: url('${url}');
                ${
                  !['regular', 'italic'].includes(variant)
                    ? `font-weight: ${variant}`
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
          })
        })
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return (
    <ConfigColumn
      title={t('personalization.fontFamily.title')}
      desc={t('personalization.fontFamily.desc')}
      icon="uil:font"
      tooltip={
        <>
          <h3 className="mb-2 flex items-center gap-2 text-xl font-medium">
            <Icon icon="simple-icons:googlefonts" className="size-6" />
            {t('personalization.fontFamily.tooltipTitle')}
          </h3>
          <p className="text-bg-500">
            {t('personalization.fontFamily.tooltip')}
          </p>
        </>
      }
      hasDivider={false}
    >
      <Listbox
        value={fontFamily}
        onChange={font => {
          setFontFamily(font)
        }}
      >
        <div className="relative mt-1 w-full md:w-64">
          <ListboxButton className="flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 py-4 pl-4 pr-10 text-left outline-none transition-all hover:bg-bg-100 focus:outline-none dark:border-bg-700 dark:bg-bg-900 dark:hover:bg-bg-800/70">
            <span
              style={{
                fontFamily
              }}
              className="-mt-px block truncate"
            >
              {fontFamily}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="h-72 w-80 divide-y divide-bg-200 rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50"
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
