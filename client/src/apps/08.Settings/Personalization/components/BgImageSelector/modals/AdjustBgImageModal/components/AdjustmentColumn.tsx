import { ConfigColumn } from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function AdjustmentColumn({
  icon,
  title,
  value,
  setValue,
  labels,
  max
}: {
  icon: string
  title: string
  value: number
  setValue: (value: number) => void
  labels: string[]
  max: number
}) {
  const { t } = useTranslation('apps.personalization')

  return (
    <ConfigColumn
      noDefaultBreakpoints
      className="dark:bg-bg-800/30 min-w-0"
      desc={t(
        `bgImageSelector.modals.adjustBackground.columns.${_.camelCase(title)}.desc`
      )}
      icon={icon}
      title={t(
        `bgImageSelector.modals.adjustBackground.columns.${_.camelCase(title)}.title`
      )}
    >
      <div className="w-full min-w-0">
        <input
          className="range range-primary bg-bg-200 dark:bg-bg-800 w-full min-w-0"
          max={max}
          min={0}
          step={1}
          type="range"
          value={value}
          onChange={e => {
            setValue(parseInt(e.target.value, 10))
          }}
        />
        <div className="mb-4 flex w-full min-w-0 justify-between px-2.5 text-xs">
          {labels.map((label, index) => (
            <div
              key={`title-${label}-${index}`}
              className="bg-bg-500 relative h-2 w-0.5 rounded-full"
            >
              <div className="text-bg-500 absolute -bottom-4 left-1/2 -translate-x-1/2">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ConfigColumn>
  )
}

export default AdjustmentColumn
