import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function ThemeSelector(): React.ReactElement {
  const { theme, setTheme } = usePersonalizationContext()
  const { t } = useTranslation()

  return (
    <ConfigColumn
      title={t('personalization.themeSelector.title')}
      desc={t('personalization.themeSelector.desc')}
      icon="tabler:palette"
      vertical
    >
      <div className="mt-4 flex w-full flex-col gap-8 px-2 md:flex-row">
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
          <div key={id} className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setTheme(id as 'system' | 'light' | 'dark')
              }}
              className={`flex-1 rounded-lg border-2 lg:rounded-xl  ${
                theme === id
                  ? 'border-custom-500'
                  : 'border-bg-200 hover:border-bg-500 dark:border-bg-700 dark:hover:border-bg-500'
              }`}
            >
              <div className="relative rounded-lg p-2 lg:rounded-2xl">
                {theme === id && (
                  <Icon
                    icon="tabler:circle-check-filled"
                    className="absolute bottom-2 right-2.5 block size-6 text-xl text-custom-500"
                  />
                )}
                <img src={Image} alt={id} className="w-full rounded-lg" />
              </div>
            </button>
            <p
              className={`mt-4 ${
                theme === id ? 'font-medium text-custom-500' : ''
              }`}
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
