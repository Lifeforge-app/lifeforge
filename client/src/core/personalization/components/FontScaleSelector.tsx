import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePersonalization } from '@lifeforge/shared'
import { Button, OptionsColumn, SliderInput } from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

function FontScaleSelector() {
  const { fontScale } = usePersonalization()

  const { changeFontScale } = useUserPersonalization()

  const { t } = useTranslation('common.personalization')

  const [selectedFontScale, setSelectedFontScale] = useState(fontScale)

  return (
    <OptionsColumn
      description={t('fontScaleSelector.desc')}
      icon="tabler:text-size"
      title={t('fontScaleSelector.title')}
    >
      <div className="flex w-full flex-col items-center gap-6 md:flex-row">
        <SliderInput
          width="100%"
          max={2}
          min={0.5}
          namespace="common.personalization"
          step={0.1}
          value={selectedFontScale}
          onChange={value => {
            setSelectedFontScale(value)
          }}
        />
        <Button
          className="w-full md:w-auto"
          disabled={selectedFontScale === fontScale}
          icon="tabler:check"
          onClick={() => {
            changeFontScale(selectedFontScale)
          }}
        >
          save
        </Button>
      </div>
    </OptionsColumn>
  )
}

export default FontScaleSelector
