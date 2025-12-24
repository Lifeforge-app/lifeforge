import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import { OptionsColumn, Switch } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

function BorderedSelector() {
  const { bordered } = usePersonalization()

  const { changeBordered } = useUserPersonalization()

  const { t } = useTranslation('common.personalization')

  return (
    <OptionsColumn
      breakpoint={false}
      description={t('borderedSelector.desc')}
      icon="tabler:border-style-2"
      title={t('borderedSelector.title')}
    >
      <Switch value={bordered} onChange={changeBordered} />
    </OptionsColumn>
  )
}

export default BorderedSelector
