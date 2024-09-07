import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function ThemeSelector(): React.ReactElement {
  const { theme, setTheme } = usePersonalizationContext()
  const { t } = useTranslation()

  return (
    <div className="w-full px-4">
      <h3 className="block text-xl font-medium leading-normal">
        {t('personalization.themeSelector.title')}
      </h3>
      <p className="text-neutral-500">
        {t('personalization.themeSelector.desc')}
      </p>
      <div className="mt-6 flex w-full flex-col gap-8 px-2 md:flex-row">
        {[
          {
            id: 'system',
            name: t('personalization.themeSelector.theme.system'),
            Image: '/assets/mockup/system.png'
          },
          {
            id: 'light',
            name: t('personalization.themeSelector.theme.light'),
            Image: '/assets/mockup/light.png'
          },
          {
            id: 'dark',
            name: t('personalization.themeSelector.theme.dark'),
            Image: '/assets/mockup/dark.png'
          }
        ].map(({ id, name, Image }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTheme(id as 'system' | 'light' | 'dark')
            }}
            className="flex-1"
          >
            <div
              className={`ring-2 ring-offset-8 ring-offset-bg-50 transition-all dark:ring-offset-bg-900 ${
                theme === id
                  ? 'ring-custom-500'
                  : 'ring-bg-200 hover:ring-bg-500 dark:ring-bg-700 dark:hover:ring-bg-500'
              } relative overflow-hidden rounded-lg lg:rounded-2xl`}
            >
              {theme === id && (
                <Icon
                  icon="tabler:circle-check-filled"
                  className="absolute bottom-2 right-2.5 block size-6 text-xl text-custom-500"
                />
              )}
              <img src={Image} alt={id} className="w-full" />
            </div>
            <p
              className={`mt-4 ${
                theme === id ? 'font-medium text-custom-500' : ''
              }`}
            >
              {name}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector
