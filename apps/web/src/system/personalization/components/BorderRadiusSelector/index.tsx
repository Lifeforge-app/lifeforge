import { useTranslation } from 'react-i18next'

import {
  Flex,
  Listbox,
  ListboxOption,
  OptionsColumn,
  Text,
  surface,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/core/providers/features/UserPersonalizationProvider'

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
        bg={surface.lightInteractive}
        minWidth="12em"
        renderContent={() => (
          <Flex align="center" gap="sm" maxWidth="12em" minWidth="0">
            <BorderRadiusIcon radius={borderRadiusMultiplier} />
            <Text truncate>
              {t(
                `borderRadiusSelector.options.${
                  BORDER_RADIUS_OPTIONS.find(
                    opt => opt.value === borderRadiusMultiplier
                  )?.labelKey ?? 'default'
                }`
              )}
            </Text>
          </Flex>
        )}
        value={borderRadiusMultiplier}
        width="100%"
        onChange={value => {
          changeBorderRadiusMultiplier(value)
        }}
      >
        {BORDER_RADIUS_OPTIONS.map(({ value, labelKey }) => (
          <ListboxOption
            key={value}
            label={t(`borderRadiusSelector.options.${labelKey}`)}
            renderColorAndIcon={() => <BorderRadiusIcon radius={value} />}
            value={value}
          />
        ))}
      </Listbox>
    </OptionsColumn>
  )
}

export default BorderRadiusSelector
