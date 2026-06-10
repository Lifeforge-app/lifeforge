import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Flex,
  Icon,
  OptionsColumn,
  Text,
  WithQuery,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

import FontFamilySelectorModal from './components/FontFamilySelectorModal'

function FontFamilySelector() {
  const { t } = useTranslation('common.personalization')
  const { open } = useModalStore()
  const { fontFamily } = usePersonalization()

  const customFontQuery = useQuery(
    forgeAPI.user.customFonts.get
      .input({
        id: fontFamily.replace('custom:', '')
      })
      .queryOptions({
        enabled: fontFamily.startsWith('custom:')
      })
  )

  return (
    <OptionsColumn
      description={t('fontFamily.desc')}
      icon="uil:font"
      title={t('fontFamily.title')}
      tooltip={
        <>
          <Flex align="center" gap="sm">
            <Icon icon="simple-icons:googlefonts" />
            <Text size="lg" weight="medium">
              {t('fontFamily.tooltipTitle')}
            </Text>
          </Flex>
          <Text as="p" color="muted" mt="sm">
            {t('fontFamily.tooltip')}
          </Text>
        </>
      }
    >
      <Flex
        align="center"
        direction={{ base: 'column', md: 'row' }}
        flexShrink="0"
        gap="lg"
        width="100%"
      >
        {fontFamily.startsWith('custom:') ? (
          <WithQuery query={customFontQuery}>
            {customFont => (
              <Box asChild flexShrink="0">
                <Text size="lg" style={{ fontFamily: customFont.family }}>
                  {customFont.displayName}
                </Text>
              </Box>
            )}
          </WithQuery>
        ) : (
          <Box asChild flexShrink="0">
            <Text size="lg" style={{ fontFamily }}>
              {fontFamily || 'Onest'}
            </Text>
          </Box>
        )}
        <Button
          icon="tabler:text-size"
          variant="secondary"
          width={{ base: '100%', md: 'auto' }}
          onClick={() => {
            open(FontFamilySelectorModal, {})
          }}
        >
          Select
        </Button>
      </Flex>
    </OptionsColumn>
  )
}

export default FontFamilySelector
