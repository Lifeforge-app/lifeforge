import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { usePersonalization } from '@lifeforge/shared'
import {
  Button,
  Flex,
  OptionsColumn,
  WithQuery,
  useModalStore
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
          <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
            <Icon className="size-5" icon="simple-icons:googlefonts" />
            {t('fontFamily.tooltipTitle')}
          </h3>
          <p className="text-bg-500 relative z-40 text-sm">
            {t('fontFamily.tooltip')}
          </p>
        </>
      }
    >
      <Flex
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap="lg"
        width="100%"
      >
        {fontFamily.startsWith('custom:') ? (
          <WithQuery query={customFontQuery}>
            {customFont => (
              <div
                className="shrink-0"
                style={{
                  fontFamily: customFont.family
                }}
              >
                {customFont.displayName}
              </div>
            )}
          </WithQuery>
        ) : (
          <div
            className="shrink-0"
            style={{
              fontFamily
            }}
          >
            {fontFamily || 'Onest'}
          </div>
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
