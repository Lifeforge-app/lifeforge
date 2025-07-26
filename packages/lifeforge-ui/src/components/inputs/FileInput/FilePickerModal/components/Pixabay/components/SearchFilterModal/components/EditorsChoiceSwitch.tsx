import { Switch } from '@components/buttons'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

import { type PixabaySearchFilterAction } from '../../../typescript/pixabay_interfaces'

interface EditorsChoiceSwitchProps {
  isEditorsChoice: boolean
  updateFilters: React.ActionDispatch<[action: PixabaySearchFilterAction]>
}

function EditorsChoiceSwitch({
  isEditorsChoice,
  updateFilters
}: EditorsChoiceSwitchProps) {
  const { t } = useTranslation('common.modals')

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="size-6" icon="tabler:user-star" />
        <span className="text-lg">{t('imageUpload.inputs.editorsChoice')}</span>
      </div>
      <Switch
        checked={isEditorsChoice}
        onChange={() => {
          updateFilters({
            type: 'SET_IS_EDITORS_CHOICE',
            payload: !isEditorsChoice
          })
        }}
      />
    </div>
  )
}

export default EditorsChoiceSwitch
