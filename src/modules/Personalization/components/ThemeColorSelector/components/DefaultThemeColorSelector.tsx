import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'

import useComponentBg from '@hooks/useComponentBg'

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
  setThemeColor,
  customThemeColor
}: {
  themeColor: string
  setThemeColor: (color: string) => void
  customThemeColor: string
}): React.ReactElement {
  const { t } = useTranslation('modules.personalization')
  const { componentBgWithHover } = useComponentBg()

  return (
    <Listbox
      value={themeColor.startsWith('#') ? 'theme-custom' : themeColor}
      onChange={color => {
        setThemeColor(color === 'theme-custom' ? customThemeColor : color)
      }}
    >
      <div className="relative mt-1 w-full lg:w-56">
        <ListboxButton
          className={clsx(
            'shadow-custom outline-hidden focus:outline-hidden flex w-full items-center gap-2 rounded-lg text-left transition-all',
            !themeColor.startsWith('#') ? 'py-4 pl-4 pr-10' : 'py-6 pl-6 pr-12',
            componentBgWithHover
          )}
        >
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
          <span
            className={clsx(
              'pointer-events-none absolute inset-y-0 right-0 flex items-center',
              themeColor.startsWith('#') ? 'pr-4' : 'pr-2'
            )}
          >
            <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          anchor="bottom end"
          className="divide-bg-200 bg-bg-100 text-bg-800 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50 focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 h-64 w-[var(--button-width)] min-w-80 divide-y overflow-auto rounded-md py-1 text-base shadow-lg transition duration-100 ease-out [--anchor-gap:8px]"
        >
          {COLORS.map(color => (
            <ListboxOption
              key={color}
              className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800 relative flex cursor-pointer select-none bg-transparent p-4 transition-all"
              value={`theme-${color}`}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-2">
                      <span
                        className={clsx(
                          'bg-custom-500 inline-block size-4 rounded-full',
                          `theme-${color}`
                        )}
                      />
                      {t(
                        `themeColorSelector.colors.${_.camelCase(
                          color
                            .split('-')
                            .map(e => e[0].toUpperCase() + e.slice(1))
                            .join(' ')
                        )}`
                      )}
                    </span>
                  </div>
                  {selected && (
                    <Icon
                      className="text-custom-500 block text-lg"
                      icon="tabler:check"
                    />
                  )}
                </>
              )}
            </ListboxOption>
          ))}
          <ListboxOption
            key="custom"
            className="flex-between hover:bg-bg-100 dark:hover:bg-bg-800 relative flex cursor-pointer select-none bg-transparent p-4 transition-all"
            value="theme-custom"
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-2">
                    <span className="border-bg-500 inline-block size-4 rounded-full border-2" />
                    {t('themeColorSelector.colors.custom')}
                  </span>
                </div>
                {selected && (
                  <Icon
                    className="text-custom-500 block text-lg"
                    icon="tabler:check"
                  />
                )}
              </>
            )}
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  )
}

export default DefaultThemeColorSelector
