/* eslint-disable tailwindcss/no-custom-classname */
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment } from 'react'
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
    <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
      <div className="w-full md:w-auto">
        <h3 className="block text-xl font-medium leading-normal">
          {t('personalization.themeColorSelector.title')}
        </h3>
        <p className="text-bg-500">
          {t('personalization.themeColorSelector.desc')}
        </p>
      </div>
      <Listbox
        value={themeColor}
        onChange={color => {
          setThemeColor(color)
        }}
      >
        <div className="relative mt-1 w-full md:w-48">
          <Listbox.Button className="relative flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 py-4 pl-4 pr-10 text-left focus:outline-none dark:border-bg-700 dark:bg-bg-900 sm:text-sm">
            <span className="inline-block size-4 shrink-0 rounded-full bg-custom-500" />
            <span className="mt-[-1px] block truncate">
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
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-900 sm:text-sm">
              {COLORS.map((color, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active ? 'bg-bg-200/50 dark:bg-bg-800' : '!bg-transparent'
                    }`
                  }
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
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default ThemeColorSelector
