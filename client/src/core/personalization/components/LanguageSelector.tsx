import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { usePersonalization } from '@lifeforge/shared'
import {
  Flex,
  Icon,
  Listbox,
  ListboxOption,
  OptionsColumn,
  Text,
  WithQuery
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'
import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

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
      <WithQuery loaderSize="1.5em" query={languagesQuery}>
        {langs => (
          <Listbox
            bg={{
              base: 'bg-100',
              hover: 'bg-200',
              dark: 'bg-800',
              darkHover: 'bg-700'
            }}
            minWidth="16em"
            renderContent={() => (
              <Flex align="center" gap="sm" maxWidth="16em" minWidth="0">
                <Icon
                  icon={langs.find(({ name }) => name === language)?.icon ?? ''}
                />
                <Text truncate>
                  {langs.find(({ name }) => name === language)?.displayName}
                </Text>
              </Flex>
            )}
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
