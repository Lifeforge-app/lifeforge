import { useTranslation } from 'react-i18next'

import { Switch } from '@/components/inputs'
import { Icon } from '@/components/primitives'
import { Flex, Text } from '@/components/primitives'

import { type PixabaySearchFilterAction } from '../../../typescript/pixabay_interfaces'

interface EditorsChoiceSwitchProps {
  isEditorsChoice: boolean
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

export function EditorsChoiceSwitch({
  isEditorsChoice,
  updateFilters
}: EditorsChoiceSwitchProps) {
  const { t } = useTranslation('common.modals')

  return (
    <Flex align="center" justify="between" py="sm">
      <Flex align="center" style={{ gap: '0.5rem' }}>
        <Icon
          icon="tabler:user-star"
          style={{ height: '1.5rem', width: '1.5rem' }}
        />
        <Text as="span" size="lg">
          {t('imagePicker.inputs.editorsChoice')}
        </Text>
      </Flex>
      <Switch
        value={isEditorsChoice}
        onChange={() => {
          updateFilters({
            type: 'SET_IS_EDITORS_CHOICE',
            payload: !isEditorsChoice
          })
        }}
      />
    </Flex>
  )
}
