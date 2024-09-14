import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

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
    <div className="flex-between mb-16 flex w-full flex-col gap-6 px-4 md:flex-row">
      <div className="flex w-full items-center gap-4">
        <Icon icon="uil:font" className="size-6 text-bg-500" />
        <div>
          <h3 className="flex w-full items-center gap-2 text-xl font-medium leading-normal md:w-auto">
            {t('personalization.fontFamily.title')}
            <a data-tooltip-id="my-tooltip">
              <Icon icon="tabler:info-circle" className="size-5 text-bg-500" />
            </a>
          </h3>
          <p className="text-bg-500">{t('personalization.fontFamily.desc')}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Listbox
          value={fontFamily}
          onChange={font => {
            setFontFamily(font)
          }}
        >
          <div className="relative mt-1 w-full md:w-64">
            <ListboxButton className="flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 py-4 pl-4 pr-10 text-left outline-none transition-all hover:bg-bg-200/50 focus:outline-none dark:border-bg-700 dark:bg-bg-900 dark:hover:bg-bg-800/70">
              <span
                style={{
                  fontFamily
                }}
                className="-mt-px block truncate"
              >
                {fontFamily}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <Icon
                  icon="tabler:chevron-down"
                  className="size-5 text-bg-500"
                />
              </span>
            </ListboxButton>
            <ListboxOptions
              transition
              anchor="bottom end"
              className="h-56 w-80 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-100"
            >
              {allFonts.map(({ family }) => (
                <ListboxOption
                  key={family}
                  className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-200/50 hover:dark:bg-bg-800"
                  value={family}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span
                          style={{
                            fontFamily: family
                          }}
                          className="flex items-center gap-2 text-base"
                        >
                          {family}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>
      <Tooltip
        id="my-tooltip"
        className="z-[9999] !rounded-md bg-bg-50 !p-4 !text-base text-bg-800 shadow-custom dark:bg-bg-900 dark:text-bg-100"
        classNameArrow="!size-6"
        place="top-start"
        positionStrategy="fixed"
        opacity={1}
      >
        <h3 className="mb-2 flex items-center gap-2 text-xl font-medium">
          <Icon icon="simple-icons:googlefonts" className="size-6" />
          {t('personalization.fontFamily.tooltipTitle')}
        </h3>
        <p className="text-bg-500">{t('personalization.fontFamily.tooltip')}</p>
      </Tooltip>
    </div>
  )
}

export default FontFamilySelector
