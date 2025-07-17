import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

function MissingAPIKeyScreen({
  requiredAPIKeys
}: {
  requiredAPIKeys: string[]
}) {
  const { t } = useTranslation('core.apiKeys')

  return (
    <div className="flex-center size-full flex-1 flex-col gap-3">
      <Icon className="size-28" icon="tabler:key-off" />
      <h2 className="text-4xl font-semibold">{t('missing.title')}</h2>
      <p className="text-bg-500 text-center text-lg">
        {t('missing.description')}
      </p>
      <p className="text-bg-500 mt-4 mb-8 text-center text-lg">
        {t('missing.requiredKeysAre')} <code>{requiredAPIKeys.join(', ')}</code>
      </p>
      <Button iconAtEnd as={Link} icon="tabler:arrow-right" to="/api-keys">
        Config API Keys
      </Button>
    </div>
  )
}

export default MissingAPIKeyScreen
