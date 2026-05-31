import { useTranslation } from 'react-i18next'

import { usePersonalization } from '@lifeforge/shared'
import {
  Bordered,
  Box,
  Flex,
  Grid,
  Icon,
  OptionsColumn,
  Text,
  Transition
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

function ThemeSelector() {
  const { theme } = usePersonalization()

  const { t } = useTranslation('common.personalization')

  const { changeTheme } = useUserPersonalization()

  return (
    <OptionsColumn
      description={t('themeSelector.desc')}
      icon="tabler:palette"
      orientation="vertical"
      title={t('themeSelector.title')}
    >
      <Grid gap="lg" px="sm" templateCols={{ md: 2, lg: 3 }}>
        {[
          {
            id: 'system',
            name: t('themeSelector.theme.system'),
            Image: '/assets/mockup/system.png'
          },
          {
            id: 'light',
            name: t('themeSelector.theme.light'),
            Image: '/assets/mockup/light.png'
          },
          {
            id: 'dark',
            name: t('themeSelector.theme.dark'),
            Image: '/assets/mockup/dark.png'
          }
        ].map(({ id, name, Image }) => (
          <Flex key={id} align="center" direction="column" gap="sm">
            <Transition>
              <Bordered
                as="button"
                borderColor={
                  theme === id
                    ? 'custom-500'
                    : {
                        base: 'bg-200',
                        hover: 'bg-500',
                        dark: 'bg-700',
                        darkHover: 'bg-500'
                      }
                }
                borderWidth="2px"
                r={{ base: 'lg', lg: 'xl' }}
                type="button"
                onClick={() => {
                  changeTheme(id as 'system' | 'light' | 'dark')
                }}
              >
                <Box p="sm" position="relative" r={{ base: 'md', lg: 'lg' }}>
                  {theme === id && (
                    <Box bottom="0.75em" position="absolute" right="0.75em">
                      <Icon
                        color="primary"
                        icon="tabler:circle-check-filled"
                        size="1.5em"
                      />
                    </Box>
                  )}
                  <Box asChild r="lg">
                    <img alt={id} src={Image} />
                  </Box>
                </Box>
              </Bordered>
            </Transition>
            <Text
              as="p"
              color={theme === id ? 'custom-500' : undefined}
              mt="sm"
              weight="medium"
            >
              {name}
            </Text>
          </Flex>
        ))}
      </Grid>
    </OptionsColumn>
  )
}

export default ThemeSelector
