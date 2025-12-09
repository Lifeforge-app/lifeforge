import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import { Icon } from '@iconify/react'
import { Listbox, ListboxOption, OptionsColumn } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

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
  const { language } = usePersonalization()

  const { changeLanguage } = useUserPersonalization()

  const { t } = useTranslation('apps.personalization')

  return (
    <OptionsColumn
      breakpoint="md"
      description={t('languageSelector.desc')}
      icon="tabler:language"
      title={t('languageSelector.title')}
    >
      <Listbox
        buttonContent={
          <div className="flex items-center gap-2">
            <Icon
              className="size-5"
              icon={LANGUAGES.find(({ code }) => code === language)?.icon ?? ''}
            />
            <span className="-mt-px block truncate">
              {LANGUAGES.find(({ code }) => code === language)?.name}
            </span>
          </div>
        }
        className="component-bg-lighter min-w-64"
        value={language}
        onChange={language => {
          changeLanguage(language)
        }}
      >
        {LANGUAGES.map(({ name, code, icon }) => (
          <ListboxOption key={code} icon={icon} label={name} value={code} />
        ))}
      </Listbox>
    </OptionsColumn>
  )
}

export default LanguageSelector
