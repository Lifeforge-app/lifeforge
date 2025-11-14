import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  ConfigColumn,
  Tooltip,
  WithQuery,
  useModalStore
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import FontFamilySelectorModal from './components/FontFamilySelectorModal'

function FontFamilySelector() {
  const { t } = useTranslation('apps.personalization')

  const open = useModalStore(state => state.open)

  const apiKeyAvailable = useQuery(
    forgeAPI.apiKeys.entries.checkKeys
      .input({
        keys: 'gcloud'
      })
      .queryOptions()
  )

  const { fontFamily } = usePersonalization()

  return (
    <ConfigColumn
      desc={t('fontFamily.desc')}
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
      <WithQuery query={apiKeyAvailable}>
        {available =>
          available ? (
            <div className="flex w-full flex-col items-center gap-6 md:flex-row">
              <div
                className="shrink-0"
                style={{
                  fontFamily
                }}
              >
                {fontFamily}
              </div>
              <Button
                className="w-full md:w-auto"
                icon="tabler:text-size"
                onClick={() => {
                  open(FontFamilySelectorModal, {})
                }}
              >
                Select
              </Button>
            </div>
          ) : (
            <>
              <p className="text-bg-500 text-sm">{t('notApplicable')}</p>
              <Tooltip icon="tabler:info-circle" id="font-family-tooltip">
                <h3 className="mb-2 flex items-center gap-2 text-lg font-medium">
                  <Icon className="size-5" icon="tabler:key-off" />
                  {t('fontFamily.empty.apiKey.title')}
                </h3>
                <p className="text-bg-500 relative z-40 text-sm">
                  {t('fontFamily.empty.apiKey.description')}
                </p>
              </Tooltip>
            </>
          )
        }
      </WithQuery>
    </ConfigColumn>
  )
}

export default FontFamilySelector
