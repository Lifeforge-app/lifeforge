import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'

import React from 'react'
import { useTranslation } from 'react-i18next'
import useThemeColors from '@hooks/useThemeColor'
import { toCamelCase } from '@utils/strings'

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
  const { t } = useTranslation()
  const { componentBgWithHover } = useThemeColors()

  return (
    <Listbox
      value={themeColor.startsWith('#') ? 'theme-custom' : themeColor}
      onChange={color => {
        setThemeColor(color === 'theme-custom' ? customThemeColor : color)
      }}
    >
      <div className="relative mt-1 w-full lg:w-56">
        <ListboxButton
          className={`flex w-full items-center gap-2 rounded-lg shadow-custom ${
            !themeColor.startsWith('#') ? 'py-4 pl-4 pr-10' : 'py-6 pl-6 pr-12'
          } text-left outline-hidden transition-all focus:outline-hidden ${componentBgWithHover}`}
        >
          <span
            className={`inline-block size-4 shrink-0 rounded-full ${
              !themeColor.startsWith('#')
                ? 'bg-custom-500'
                : 'border-2 border-bg-500'
            }`}
          />
          <span className="-mt-px block truncate">
            {t(
              `personalization.themeColorSelector.colors.${
                !themeColor.startsWith('#')
                  ? toCamelCase(
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
            className={`pointer-events-none absolute inset-y-0 right-0 flex items-center ${
              themeColor.startsWith('#') ? 'pr-4' : 'pr-2'
            }`}
          >
            <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
          </span>
        </ListboxButton>
        <ListboxOptions
          transition
          anchor="bottom end"
          className="h-64 w-80 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50"
        >
          {COLORS.map(color => (
            <ListboxOption
              key={color}
              className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-100 dark:hover:bg-bg-800"
              value={`theme-${color}`}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-2">
                      <span
                        className={`theme-${color} inline-block size-4 rounded-full bg-custom-500`}
                      />
                      {t(
                        `personalization.themeColorSelector.colors.${toCamelCase(
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
                      icon="tabler:check"
                      className="block text-lg text-custom-500"
                    />
                  )}
                </>
              )}
            </ListboxOption>
          ))}
          <ListboxOption
            key="custom"
            className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-100 dark:hover:bg-bg-800"
            value="theme-custom"
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-2">
                    <span className="inline-block size-4 rounded-full border-2 border-bg-500" />
                    {t('personalization.themeColorSelector.colors.custom')}
                  </span>
                </div>
                {selected && (
                  <Icon
                    icon="tabler:check"
                    className="block text-lg text-custom-500"
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
