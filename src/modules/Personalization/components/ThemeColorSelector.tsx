import React, { Fragment, useContext } from 'react'
import { PersonalizationContext } from '../../../providers/PersonalizationProvider'
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'

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
  const { themeColor, setThemeColor } = useContext(PersonalizationContext)

  return (
    <div className="mb-12 mt-4 flex w-full items-center justify-between">
      <div>
        <h3 className="block text-xl font-medium leading-normal">
          Accent color
        </h3>
        <p className="text-neutral-500">
          Select or customize your UI accent color.
        </p>
      </div>
      <Listbox
        value={themeColor}
        onChange={color => {
          setThemeColor(color)
        }}
      >
        <div className="relative mt-1 w-48">
          <Listbox.Button className="relative flex w-full items-center gap-2 rounded-lg border-[1.5px] border-neutral-300/50 py-4 pl-4 pr-10 text-left focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 sm:text-sm">
            <span className="inline-block h-4 w-4 rounded-full bg-custom-500" />
            <span className="mt-[-1px] block truncate">
              {themeColor
                .split('-')
                .slice(1)
                .map(e => e[0].toUpperCase() + e.slice(1))
                .join(' ')}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <Icon
                icon="tabler:chevron-down"
                className="h-5 w-5 text-neutral-400"
              />
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
            <Listbox.Options className="absolute mt-1 max-h-32 w-full divide-y divide-neutral-200 overflow-auto rounded-md bg-neutral-100 py-1 text-base shadow-lg focus:outline-none dark:divide-neutral-700 dark:bg-neutral-800/50 sm:text-sm">
              {COLORS.map((color, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-neutral-200/50 dark:bg-neutral-800'
                        : '!bg-transparent'
                    }`
                  }
                  value={`theme-${color}`}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2">
                          <span
                            className={`theme-${color} inline-block h-4 w-4 rounded-full bg-custom-500`}
                          />
                          {color
                            .split('-')
                            .map(e => e[0].toUpperCase() + e.slice(1))
                            .join(' ')}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="texy-lg block text-gray-400 group-hover:text-custom-200"
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
