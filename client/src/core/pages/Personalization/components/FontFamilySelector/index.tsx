import { Icon } from '@iconify/react'
import { Button, ConfigColumn, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import FontFamilySelectorModal from './components/FontFamilySelectorModal'

function FontFamilySelector() {
  const { t } = useTranslation('core.personalization')

  const open = useModalStore(state => state.open)

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
      <div className="flex items-center gap-6">
        <div
          className="shrink-0"
          style={{
            fontFamily
          }}
        >
          {fontFamily}
        </div>
        <Button
          icon="tabler:text-size"
          onClick={() => {
            open(FontFamilySelectorModal, {})
          }}
        >
          Select
        </Button>
      </div>
    </ConfigColumn>
  )
}

export default FontFamilySelector
