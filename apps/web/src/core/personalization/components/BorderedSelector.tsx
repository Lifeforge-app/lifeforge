import { useTranslation } from 'react-i18next'

import { OptionsColumn, Switch, usePersonalization } from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

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
