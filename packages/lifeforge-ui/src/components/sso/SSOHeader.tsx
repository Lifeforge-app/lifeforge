import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { Button } from '../buttons'

function SSOHeader({
  icon,
  namespace,
  link,
  className,
  actionButtonProps
}: {
  icon: string
  namespace: string
  link: string
  className?: string
  actionButtonProps?: React.ComponentProps<typeof Button>
}) {
  const { t } = useTranslation(namespace)

  return (
    <header
      className={clsx(
        'flex w-full items-center justify-between p-12',
        className
      )}
    >
      <h1 className="flex items-center gap-2">
        <Icon className="text-custom-400 text-4xl" icon={icon} />
        <div>
          <div className="text-xl font-semibold">
            LifeForge<span className="text-custom-400">.</span>
          </div>
          <div className="text-bg-500 text-sm font-medium">{t('title')}</div>
        </div>
      </h1>
      <div className="flex items-center gap-6">
        {actionButtonProps && <Button {...actionButtonProps} />}
        <Button
          as="a"
          href={link}
          icon="uil:github"
          iconClassName="size-6"
          rel="noopener noreferrer"
          target="_blank"
          variant="plain"
        />
      </div>
    </header>
  )
}

export default SSOHeader
