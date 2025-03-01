import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfigColumn from '@components/utilities/ConfigColumn'
import useThemeColors from '@hooks/useThemeColor'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import clsx from 'clsx'

const LANGUAGES: Array<{
  name: string
  code: string
  icon: string
}> = [
  {
    name: 'English',
    code: 'en',
    icon: 'circle-flags:us'
  },
  {
    name: '简体中文',
    code: 'zh-CN',
    icon: 'circle-flags:zh'
  },
  {
    name: '繁體中文',
    code: 'zh-TW',
    icon: 'circle-flags:tw'
  },
  {
    name: 'Bahasa Malaysia',
    code: 'ms',
    icon: 'circle-flags:my'
  }
]

function LanguageSelector(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const { language, setLanguage } = usePersonalizationContext()
  const { t } = useTranslation('modules.personalization')

  return (
    <ConfigColumn
      desc={t('languageSelector.desc')}
      icon="tabler:language"
      title={t('languageSelector.title')}
    >
      <Listbox
        value={language}
        onChange={language => {
          setLanguage(language)
        }}
      >
        <div className="relative mt-1 w-full md:w-64">
          <ListboxButton
            className={clsx(
              'flex w-full items-center gap-2 rounded-lg py-4 pl-4 pr-10 text-left shadow-custom outline-hidden transition-all focus:outline-hidden',
              componentBgWithHover
            )}
          >
            <Icon
              className="size-5"
              icon={LANGUAGES.find(({ code }) => code === language)?.icon ?? ''}
            />
            <span className="-mt-px block truncate">
              {LANGUAGES.find(({ code }) => code === language)?.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon className="size-5 text-bg-500" icon="tabler:chevron-down" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="max-h-56 w-80 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50"
          >
            {LANGUAGES.map(({ name, code, icon }) => (
              <ListboxOption
                key={code}
                className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-100 dark:hover:bg-bg-800"
                value={code}
              >
                {({ selected }) => (
                  <>
                    <div>
                      <span className="flex items-center gap-2">
                        <Icon className="size-5" icon={icon} />
                        {name}
                      </span>
                    </div>
                    {selected && (
                      <Icon
                        className="block text-lg text-custom-500"
                        icon="tabler:check"
                      />
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>
    </ConfigColumn>
  )
}

export default LanguageSelector
