import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import { Button, ConfigColumn, SliderInput } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

function FontScaleSelector() {
  const { fontScale } = usePersonalization()

  const { changeFontScale } = useUserPersonalization()

  const { t } = useTranslation('core.personalization')

  const [selectedFontScale, setSelectedFontScale] = useState(fontScale)

  return (
    <ConfigColumn
      desc={t('fontScaleSelector.desc')}
      icon="tabler:text-size"
      title={t('fontScaleSelector.title')}
    >
      <div className="flex w-full flex-col items-center gap-6 md:flex-row">
        <SliderInput
          className="w-full"
          max={2}
          min={0.5}
          namespace="core.personalization"
          setValue={value => {
            setSelectedFontScale(value)
          }}
          step={0.1}
          value={selectedFontScale}
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
    </ConfigColumn>
  )
}

export default FontScaleSelector
