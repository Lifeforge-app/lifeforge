import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { ConfigColumn, Tooltip } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import FontFamilyItem from './components/FontFamilyItem'

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
  const { t } = useTranslation('modules.personalization')
  const [enabled, setEnabled] = useState(false)
  const { componentBgWithHover } = useComponentBg()
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
      {enabled ? (
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
                <Icon
                  className="text-bg-500 size-5"
                  icon="tabler:chevron-down"
                />
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
      ) : (
        <p className="text-bg-500 flex items-center gap-2">
          {t('fontFamily.disabled.title')}
          <Tooltip
            icon="tabler:info-circle"
            id="fontFamilyDisabled"
            tooltipProps={{
              clickable: true
            }}
          >
            <p className="text-bg-500 max-w-84">
              {t('fontFamily.disabled.tooltip')}{' '}
              <a
                className="font-medium underline text-custom-500 decoration-custom-500 decoration-2"
                href="https://docs.lifeforge.melvinchia.dev/user-guide/personalization#font-family"
                rel="noopener noreferrer"
                target="_blank"
              >
                Customization Guide
              </a>
            </p>
          </Tooltip>
        </p>
      )}
    </ConfigColumn>
  )
}

export default FontFamilySelector
