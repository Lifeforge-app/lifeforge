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
  const { t } = useTranslation()

  return (
    <div className="flex-center size-full flex-1 flex-col gap-4">
      <Icon icon="tabler:key-off" className="size-28" />
      <h2 className="text-4xl font-semibold">{t('apiKeys.missing.title')}</h2>
      <p className="text-center text-lg text-bg-500">
        {t('apiKeys.missing.description')}
      </p>
      <p className="mb-8 mt-4 text-center text-lg text-bg-500">
        {t('apiKeys.missing.requiredKeysAre')}{' '}
        <code>{requiredAPIKeys.join(', ')}</code>
      </p>
      <Button as={Link} to="/api-keys" icon="tabler:arrow-right" iconAtEnd>
        Config API Keys
      </Button>
    </div>
  )
}

export default MissingAPIKeyScreen
