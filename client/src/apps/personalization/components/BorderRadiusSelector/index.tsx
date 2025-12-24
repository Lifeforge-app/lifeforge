import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import { Listbox, ListboxOption, OptionsColumn } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

import BorderRadiusIcon from './components/BorderRadiusIcon'

const BORDER_RADIUS_OPTIONS = [
  { value: 0, labelKey: 'none' },
  { value: 0.5, labelKey: 'small' },
  { value: 1, labelKey: 'default' },
  { value: 2, labelKey: 'medium' },
  { value: 3, labelKey: 'large' },
  { value: 3.6, labelKey: 'full' }
] as const

function BorderRadiusSelector() {
  const { borderRadiusMultiplier } = usePersonalization()

  const { changeBorderRadiusMultiplier } = useUserPersonalization()

  const { t } = useTranslation('common.personalization')

  return (
    <OptionsColumn
      breakpoint="md"
      description={t('borderRadiusSelector.desc')}
      icon="tabler:border-radius"
      title={t('borderRadiusSelector.title')}
    >
      <Listbox
        buttonContent={
          <div className="flex items-center gap-2">
            <BorderRadiusIcon radius={borderRadiusMultiplier} />
            <span className="-mt-px block truncate">
              {t(
                `borderRadiusSelector.options.${
                  BORDER_RADIUS_OPTIONS.find(
                    opt => opt.value === borderRadiusMultiplier
                  )?.labelKey ?? 'default'
                }`
              )}
            </span>
          </div>
        }
        className="component-bg-lighter min-w-48"
        value={borderRadiusMultiplier}
        onChange={value => {
          changeBorderRadiusMultiplier(value)
        }}
      >
        {BORDER_RADIUS_OPTIONS.map(({ value, labelKey }) => (
          <ListboxOption
            key={value}
            label={t(`borderRadiusSelector.options.${labelKey}`)}
            renderColorAndIcon={() => (
              <BorderRadiusIcon className="mr-2 size-4" radius={value} />
            )}
            value={value}
          />
        ))}
      </Listbox>
    </OptionsColumn>
  )
}

export default BorderRadiusSelector
