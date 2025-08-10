import { Icon } from '@iconify/react/dist/iconify.js'
import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import { ConfigColumn, Listbox, ListboxOption } from 'lifeforge-ui'
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

  const { t } = useTranslation('core.personalization')

  return (
    <ConfigColumn
      desc={t('languageSelector.desc')}
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
        className="min-w-64"
        setValue={language => {
          changeLanguage(language)
        }}
        value={language}
      >
        {LANGUAGES.map(({ name, code, icon }) => (
          <ListboxOption key={code} icon={icon} text={name} value={code} />
        ))}
      </Listbox>
    </ConfigColumn>
  )
}

export default LanguageSelector
