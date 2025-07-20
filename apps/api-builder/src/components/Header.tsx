import { Icon } from '@iconify/react/dist/iconify.js'
import { useTranslation } from 'react-i18next'

import { Button } from '@lifeforge/ui'

function Header() {
  const { t } = useTranslation('core.apiExplorer')

  return (
    <header className="flex w-full items-center justify-between p-6">
      <h1 className="flex items-center gap-2">
        <Icon icon="mynaui:api" className="text-custom-400 text-4xl" />
        <div>
          <div className="text-xl font-semibold">
            LifeForge<span className="text-custom-400">.</span>
          </div>
          <div className="text-bg-500 text-sm font-medium">{t('title')}</div>
        </div>
      </h1>
      <Button
        as="a"
        icon="uil:github"
        variant="plain"
        iconClassName="size-6"
        rel="noopener noreferrer"
        target="_blank"
        href="https://github.com/Lifeforge-app/lifeforge-api-explorer"
      />
    </header>
  )
}

export default Header
