import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { OptionsColumn, SliderInput, surface } from '@lifeforge/ui'

function AdjustmentColumn({
  icon,
  title,
  value,
  onChange,
  max
}: {
  icon: string
  title: string
  value: number
  onChange: (value: number) => void
  max: number
}) {
  const { t } = useTranslation('common.personalization')

  return (
    <OptionsColumn
      bg={surface.light}
      description={t(
        `bgImageSelector.modals.adjustBackground.columns.${_.camelCase(title)}.desc`
      )}
      icon={icon}
      orientation="vertical"
      title={t(
        `bgImageSelector.modals.adjustBackground.columns.${_.camelCase(title)}.title`
      )}
    >
      <SliderInput
        max={max}
        min={0}
        step={1}
        value={value}
        onChange={onChange}
      />
    </OptionsColumn>
  )
}

export default AdjustmentColumn
