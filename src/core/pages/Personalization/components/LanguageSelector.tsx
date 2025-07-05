import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { ConfigColumn } from '@lifeforge/ui'

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

function LanguageSelector() {
  const { language, setLanguage } = usePersonalization()
  const { t } = useTranslation('core.personalization')

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
              'shadow-custom component-bg-with-hover flex w-full items-center gap-2 rounded-lg py-4 pr-10 pl-4 text-left outline-hidden transition-all focus:outline-hidden'
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
              <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="divide-bg-200 bg-bg-100 text-bg-800 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50 max-h-56 w-80 divide-y overflow-auto rounded-md py-1 text-base shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
          >
            {LANGUAGES.map(({ name, code, icon }) => (
              <ListboxOption
                key={code}
                className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800 relative flex cursor-pointer bg-transparent p-4 transition-all select-none"
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
                        className="text-custom-500 block text-lg"
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
