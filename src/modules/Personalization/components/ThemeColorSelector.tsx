/* eslint-disable tailwindcss/no-custom-classname */
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
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

function ThemeColorSelector(): React.ReactElement {
  const { themeColor, setThemeColor } = usePersonalizationContext()
  const { t } = useTranslation()

  return (
    <div className="flex-between flex w-full flex-col gap-6 px-4 md:flex-row">
      <div className="flex items-center gap-4">
        <Icon icon="tabler:palette" className="size-6 text-bg-500" />
        <div className="w-full md:w-auto">
          <h3 className="block text-xl font-medium leading-normal">
            {t('personalization.themeColorSelector.title')}
          </h3>
          <p className="text-bg-500">
            {t('personalization.themeColorSelector.desc')}
          </p>
        </div>
      </div>
      <Listbox
        value={themeColor}
        onChange={color => {
          setThemeColor(color)
        }}
      >
        <div className="relative mt-1 w-full md:w-48">
          <ListboxButton className="flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 py-4 pl-4 pr-10 text-left outline-none transition-all hover:bg-bg-200/50 focus:outline-none dark:border-bg-700 dark:bg-bg-900 dark:hover:bg-bg-800/70">
            <span className="inline-block size-4 shrink-0 rounded-full bg-custom-500" />
            <span className="-mt-px block truncate">
              {t(
                `personalization.themeColorSelector.colors.${toCamelCase(
                  themeColor
                    .split('-')
                    .slice(1)
                    .map(e => e[0].toUpperCase() + e.slice(1))
                    .join(' ')
                )}`
              )}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
            </span>
          </ListboxButton>
          <ListboxOptions
            transition
            anchor="bottom end"
            className="h-64 w-80 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-100"
          >
            {COLORS.map(color => (
              <ListboxOption
                key={color}
                className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-200/50 hover:dark:bg-bg-800"
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
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  )
}

export default ThemeColorSelector
