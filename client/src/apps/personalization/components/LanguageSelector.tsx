import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { Listbox, ListboxOption, OptionsColumn, WithQuery } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

function LanguageSelector() {
  const { language } = usePersonalization()

  const { changeLanguage } = useUserPersonalization()

  const { t } = useTranslation('common.personalization')

  const languagesQuery = useQuery(forgeAPI.locales.listLanguages.queryOptions())

  return (
    <OptionsColumn
      breakpoint="md"
      description={t('languageSelector.desc')}
      icon="tabler:language"
      title={t('languageSelector.title')}
    >
      <WithQuery loaderSize="1.5rem" query={languagesQuery}>
        {langs => (
          <Listbox
            buttonContent={
              <div className="flex items-center gap-2">
                <Icon
                  className="size-5"
                  icon={langs.find(({ name }) => name === language)?.icon ?? ''}
                />
                <span className="-mt-px block truncate">
                  {langs.find(({ name }) => name === language)?.displayName}
                </span>
              </div>
            }
            className="component-bg-lighter min-w-64"
            value={language}
            onChange={language => {
              changeLanguage(language)
            }}
          >
            {langs.map(({ displayName, icon, name }) => (
              <ListboxOption
                key={displayName}
                icon={icon}
                label={displayName}
                value={name}
              />
            ))}
          </Listbox>
        )}
      </WithQuery>
    </OptionsColumn>
  )
}

export default LanguageSelector
