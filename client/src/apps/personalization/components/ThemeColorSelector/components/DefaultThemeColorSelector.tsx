import { useUserPersonalization } from '@/providers/UserPersonalizationProvider'
import clsx from 'clsx'
import { Listbox, ListboxOption } from 'lifeforge-ui'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

const COLORS = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'grey'
]

function DefaultThemeColorSelector({
  themeColor,
  customThemeColor
}: {
  themeColor: string
  customThemeColor: string
}) {
  const { t } = useTranslation('apps.personalization')

  const { changeThemeColor } = useUserPersonalization()

  return (
    <Listbox
      buttonContent={
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'inline-block size-4 shrink-0 rounded-full',
              !themeColor.startsWith('#')
                ? 'bg-custom-500'
                : 'border-bg-500 border-2'
            )}
          />
          <span className="-mt-px block truncate">
            {t(
              `themeColorSelector.colors.${
                !themeColor.startsWith('#')
                  ? _.camelCase(
                      themeColor
                        .split('-')
                        .slice(1)
                        .map(e => e[0].toUpperCase() + e.slice(1))
                        .join(' ')
                    )
                  : 'custom'
              }`
            )}
          </span>
        </div>
      }
      className="min-w-64 p-6"
      onChange={color => {
        changeThemeColor(color === 'theme-custom' ? customThemeColor : color)
      }}
      value={themeColor.startsWith('#') ? 'theme-custom' : themeColor}
    >
      {COLORS.map(color => (
        <ListboxOption
          key={color}
          label={t(
            `themeColorSelector.colors.${_.camelCase(
              color
                .split('-')
                .map(e => e[0].toUpperCase() + e.slice(1))
                .join(' ')
            )}`
          )}
          renderColorAndIcon={() => (
            <span
              className={clsx(
                'bg-custom-500 inline-block size-4 rounded-full',
                `theme-${color}`
              )}
            />
          )}
          value={`theme-${color}`}
        />
      ))}
      <ListboxOption
        key="custom"
        label={t('themeColorSelector.colors.custom')}
        renderColorAndIcon={() => (
          <span className="border-bg-500 inline-block size-4 rounded-full border-2" />
        )}
        value="theme-custom"
      />
    </Listbox>
  )
}

export default DefaultThemeColorSelector
