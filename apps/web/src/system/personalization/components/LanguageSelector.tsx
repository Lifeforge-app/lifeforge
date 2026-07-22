import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Flex,
  Icon,
  Listbox,
  ListboxOption,
  OptionsColumn,
  Text,
  Tooltip,
  WithQuery,
  surface,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/core/providers/features/UserPersonalizationProvider'
import forgeAPI from '@/core/utils/forgeAPI'

function LanguageSelector() {
  const { language } = usePersonalization()
  const { changeLanguage } = useUserPersonalization()
  const { t } = useTranslation('common.personalization')
  const languagesQuery = useQuery(forgeAPI.locales.listLanguages.queryOptions())

  const unsupportedQuery = useQuery(
    forgeAPI.locales.listUnsupportedModules.queryOptions({
      queryKey: [...forgeAPI.locales.listUnsupportedModules.key, language]
    })
  )

  return (
    <OptionsColumn
      breakpoint="md"
      description={t('languageSelector.desc')}
      icon="tabler:language"
      title={t('languageSelector.title')}
    >
      <WithQuery loaderSize="1.5em" query={languagesQuery}>
        {langs => (
          <Flex align="center" gap="sm" width="100%">
            <Listbox
              bg={surface.lightInteractive}
              minWidth="16em"
              mr="sm"
              renderContent={() => (
                <Flex align="center" gap="sm" maxWidth="16em" minWidth="0">
                  <Icon
                    icon={
                      langs.find(({ name }) => name === language)?.icon ?? ''
                    }
                  />
                  <Text truncate>
                    {langs.find(({ name }) => name === language)?.displayName}
                  </Text>
                </Flex>
              )}
              value={language}
              width="100%"
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
            {unsupportedQuery.data && unsupportedQuery.data.length > 0 && (
              <Tooltip icon="tabler:alert-triangle" id="unsupported-modules">
                {t(
                  'unsupportedModulesWarning',
                  'The following modules do not support the selected language:'
                )}
                <Box
                  as="ul"
                  mt="sm"
                  pl="md"
                  style={{
                    listStyleType: 'disc'
                  }}
                >
                  {unsupportedQuery.data.map(name => (
                    <li key={name}>{name}</li>
                  ))}
                </Box>
              </Tooltip>
            )}
          </Flex>
        )}
      </WithQuery>
    </OptionsColumn>
  )
}

export default LanguageSelector
