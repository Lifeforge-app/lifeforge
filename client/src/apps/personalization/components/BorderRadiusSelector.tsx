import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import { Button, OptionsColumn, SliderInput } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

function BorderRadiusSelector() {
  const { borderRadiusMultiplier } = usePersonalization()

  const { changeBorderRadiusMultiplier } = useUserPersonalization()

  const { t } = useTranslation('apps.personalization')

  const [selectedMultiplier, setSelectedMultiplier] = useState(
    borderRadiusMultiplier
  )

  return (
    <OptionsColumn
      description={t('borderRadiusSelector.desc')}
      icon="tabler:border-radius"
      title={t('borderRadiusSelector.title')}
    >
      <div className="flex w-full flex-col items-center gap-6 md:flex-row">
        <SliderInput
          className="w-full"
          max={5}
          min={0}
          namespace="apps.personalization"
          step={0.1}
          value={selectedMultiplier}
          onChange={value => {
            setSelectedMultiplier(value)
          }}
        />
        <Button
          className="w-full md:w-auto"
          disabled={selectedMultiplier === borderRadiusMultiplier}
          icon="tabler:check"
          onClick={() => {
            changeBorderRadiusMultiplier(selectedMultiplier)
          }}
        >
          save
        </Button>
      </div>
    </OptionsColumn>
  )
}

export default BorderRadiusSelector
