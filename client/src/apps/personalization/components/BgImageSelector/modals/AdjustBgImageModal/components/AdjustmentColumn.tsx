import { OptionsColumn, SliderInput } from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('apps.personalization')

  return (
    <OptionsColumn
      breakpoint="md"
      className="dark:bg-bg-800/30 min-w-0"
      description={t(
        `bgImageSelector.modals.adjustBackground.columns.${_.camelCase(title)}.desc`
      )}
      icon={icon}
      title={t(
        `bgImageSelector.modals.adjustBackground.columns.${_.camelCase(title)}.title`
      )}
    >
      <SliderInput
        className="min-w-0"
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
