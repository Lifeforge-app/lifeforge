/* eslint-disable tailwindcss/no-custom-classname */
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

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
  const { language, setLanguage } = usePersonalizationContext()
  const { t } = useTranslation()

  return (
    <ConfigColumn
      title={t('personalization.languageSelector.title')}
      desc={t('personalization.languageSelector.desc')}
      icon="tabler:language"
    >
      <Listbox
        value={language}
        onChange={language => {
          setLanguage(language)
        }}
      >
        <div className="relative mt-1 w-full md:w-64">
          <ListboxButton className="flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 py-4 pl-4 pr-10 text-left outline-none transition-all hover:bg-bg-200/50 focus:outline-none dark:border-bg-700 dark:bg-bg-900 dark:hover:bg-bg-800/70">
            <Icon
              icon={LANGUAGES.find(({ code }) => code === language)?.icon ?? ''}
              className="size-5"
            />
            <span className="-mt-px block truncate">
              {LANGUAGES.find(({ code }) => code === language)?.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="max-h-56 w-80 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-100"
          >
            {LANGUAGES.map(({ name, code, icon }) => (
              <ListboxOption
                key={code}
                className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-200/50 hover:dark:bg-bg-800"
                value={code}
              >
                {({ selected }) => (
                  <>
                    <div>
                      <span className="flex items-center gap-2">
                        <Icon icon={icon} className="size-5" />
                        {name}
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
    </ConfigColumn>
  )
}

export default LanguageSelector
