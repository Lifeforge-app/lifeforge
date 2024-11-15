import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'

function MissingAPIKeyScreen({
  requiredAPIKeys
}: {
  requiredAPIKeys: string[]
}): React.ReactElement {
  return (
    <div className="flex-center flex size-full flex-1 flex-col gap-4">
      <Icon icon="tabler:key-off" className="size-28" />
      <h2 className="text-4xl font-semibold">{t('apiKeys.missing.title')}</h2>
      <p className="text-center text-lg text-bg-500">
        {t('apiKeys.missing.description')}
      </p>
      <p className="mb-8 mt-4 text-center text-lg text-bg-500">
        {t('apiKeys.missing.requiredKeysAre')}{' '}
        <code>{requiredAPIKeys.join(', ')}</code>
      </p>
      <Button
        CustomElement={Link}
        to="/api-keys"
        icon="tabler:arrow-right"
        iconAtEnd
      >
        Config API Keys
      </Button>
    </div>
  )
}

export default MissingAPIKeyScreen
