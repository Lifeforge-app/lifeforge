import { Listbox, ListboxButton, ListboxOptions } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import clsx from 'clsx'
import { Tooltip } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import FontFamilyItem from './FontFamilyItem'

interface FontFamilyListProps {
  enabled: string | boolean
  fontFamily: string
  allFonts: any[]
}

function FontFamilyList({
  enabled,
  fontFamily,
  allFonts
}: FontFamilyListProps) {
  const { t } = useTranslation('core.personalization')
  const { changeFontFamily } = useUserPersonalization()

  if (enabled === 'loading') {
    return <Icon className="text-bg-500 size-6" icon="svg-spinners:180-ring" />
  }

  if (enabled) {
    return (
      <Listbox
        value={fontFamily}
        onChange={font => {
          changeFontFamily(font)
        }}
      >
        <div className="relative mt-1 w-full md:w-64">
          <ListboxButton
            className={clsx(
              'shadow-custom component-bg-with-hover flex w-full items-center gap-2 rounded-lg py-4 pr-10 pl-4 text-left outline-hidden transition-all focus:outline-hidden'
            )}
          >
            <span
              className="-mt-px block truncate"
              style={{
                fontFamily: `"${fontFamily}", sans-serif`
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
            className="divide-bg-200 bg-bg-100 text-bg-800 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50 h-72 w-80 divide-y rounded-md py-1 text-base shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
          >
            {allFonts.map(({ family }) => (
              <FontFamilyItem key={family} family={family} />
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    )
  }

  return (
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
            className="text-custom-500 decoration-custom-500 font-medium underline decoration-2"
            href="https://docs.lifeforge.melvinchia.dev/user-guide/personalization#font-family"
            rel="noopener noreferrer"
            target="_blank"
          >
            Customization Guide
          </a>
        </p>
      </Tooltip>
    </p>
  )
}

export default FontFamilyList
