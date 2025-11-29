import { useUserPersonalization } from '@/providers/UserPersonalizationProvider'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { OptionsColumn } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { usePersonalization } from 'shared'

function ThemeSelector() {
  const { theme } = usePersonalization()

  const { t } = useTranslation('apps.personalization')

  const { changeTheme } = useUserPersonalization()

  return (
    <OptionsColumn
      description={t('themeSelector.desc')}
      icon="tabler:palette"
      orientation="vertical"
      title={t('themeSelector.title')}
    >
      <div className="flex w-full flex-col gap-8 px-2 md:flex-row">
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
          <div
            key={id}
            className="flex w-full flex-col items-center gap-2 md:w-1/3"
          >
            <button
              className={clsx(
                'flex-1 rounded-lg border-2 lg:rounded-xl',
                theme === id
                  ? 'border-custom-500'
                  : 'border-bg-200 hover:border-bg-500 dark:border-bg-700 dark:hover:border-bg-500'
              )}
              type="button"
              onClick={() => {
                changeTheme(id as 'system' | 'light' | 'dark')
              }}
            >
              <div className="relative rounded-lg p-2 lg:rounded-2xl">
                {theme === id && (
                  <Icon
                    className="text-custom-500 absolute right-2.5 bottom-2 block size-6 text-xl"
                    icon="tabler:circle-check-filled"
                  />
                )}
                <img alt={id} className="w-full rounded-lg" src={Image} />
              </div>
            </button>
            <p
              className={clsx(
                'mt-4',
                theme === id && 'text-custom-500 font-medium'
              )}
            >
              {name}
            </p>
          </div>
        ))}
      </div>
    </OptionsColumn>
  )
}

export default ThemeSelector
