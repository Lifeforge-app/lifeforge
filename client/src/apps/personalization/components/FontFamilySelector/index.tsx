import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { Button, OptionsColumn, WithQuery, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import FontFamilySelectorModal from './components/FontFamilySelectorModal'

function FontFamilySelector() {
  const { t } = useTranslation('common.personalization')

  const open = useModalStore(state => state.open)

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
      <div className="flex w-full flex-col items-center gap-6 md:flex-row">
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
            {fontFamily}
          </div>
        )}
        <Button
          className="w-full md:w-auto"
          icon="tabler:text-size"
          variant="secondary"
          onClick={() => {
            open(FontFamilySelectorModal, {})
          }}
        >
          Select
        </Button>
      </div>
    </OptionsColumn>
  )
}

export default FontFamilySelector
