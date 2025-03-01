import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function ThemeSelector(): React.ReactElement {
  const { theme, setTheme } = usePersonalizationContext()
  const { t } = useTranslation('modules.personalization')

  return (
    <ConfigColumn
      vertical
      desc={t('themeSelector.desc')}
      icon="tabler:palette"
      title={t('themeSelector.title')}
    >
      <div className="mt-4 flex w-full flex-col gap-8 px-2 md:flex-row">
        {[
          {
            id: 'system',
            name: t('themeSelector.theme.system'),
            Image: '/assets/mockup/system.png'
          },
          {
            id: 'light',
            name: t('themeSelector.theme.light'),
            Image: '/assets/mockup/light.png'
          },
          {
            id: 'dark',
            name: t('themeSelector.theme.dark'),
            Image: '/assets/mockup/dark.png'
          }
        ].map(({ id, name, Image }) => (
          <div key={id} className="flex flex-col items-center gap-2">
            <button
              className={clsx(
                'flex-1 rounded-lg border-2 lg:rounded-xl',
                theme === id
                  ? 'border-custom-500'
                  : 'border-bg-200 hover:border-bg-500 dark:border-bg-700 dark:hover:border-bg-500'
              )}
              type="button"
              onClick={() => {
                setTheme(id as 'system' | 'light' | 'dark')
              }}
            >
              <div className="relative rounded-lg p-2 lg:rounded-2xl">
                {theme === id && (
                  <Icon
                    className="absolute bottom-2 right-2.5 block size-6 text-xl text-custom-500"
                    icon="tabler:circle-check-filled"
                  />
                )}
                <img alt={id} className="w-full rounded-lg" src={Image} />
              </div>
            </button>
            <p
              className={clsx(
                'mt-4',
                theme === id && 'font-medium text-custom-500'
              )}
            >
              {name}
            </p>
          </div>
        ))}
      </div>
    </ConfigColumn>
  )
}

export default ThemeSelector
