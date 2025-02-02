import { Icon } from '@iconify/react'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@components/buttons'

function MissingAPIKeyScreen({
  requiredAPIKeys
}: {
  requiredAPIKeys: string[]
}): React.ReactElement {
  const { t } = useTranslation('modules.apiKeys')

  return (
    <div className="flex-center size-full flex-1 flex-col gap-4">
      <Icon className="size-28" icon="tabler:key-off" />
      <h2 className="text-4xl font-semibold">{t('apiKeys.missing.title')}</h2>
      <p className="text-center text-lg text-bg-500">
        {t('apiKeys.missing.description')}
      </p>
      <p className="mb-8 mt-4 text-center text-lg text-bg-500">
        {t('apiKeys.missing.requiredKeysAre')}{' '}
        <code>{requiredAPIKeys.join(', ')}</code>
      </p>
      <Button iconAtEnd as={Link} icon="tabler:arrow-right" to="/api-keys">
        Config API Keys
      </Button>
    </div>
  )
}

export default MissingAPIKeyScreen
