import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

function Header() {
  const { t } = useTranslation('apps.apiExplorer')

  return (
    <header className="flex w-full items-center justify-between p-6">
      <h1 className="flex items-center gap-2">
        <Icon className="text-custom-400 text-4xl" icon="mynaui:api" />
        <div>
          <div className="text-xl font-semibold">
            LifeForge<span className="text-custom-400">.</span>
          </div>
          <div className="text-bg-500 text-sm font-medium">{t('title')}</div>
        </div>
      </h1>
      <Button
        as="a"
        href="https://github.com/Lifeforge-app/lifeforge-api-explorer"
        icon="uil:github"
        iconClassName="size-6"
        rel="noopener noreferrer"
        target="_blank"
        variant="plain"
      />
    </header>
  )
}

export default Header
