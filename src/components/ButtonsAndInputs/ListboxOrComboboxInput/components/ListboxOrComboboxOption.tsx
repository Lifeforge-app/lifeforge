/* eslint-disable @typescript-eslint/member-delimiter-style */
import {
  ListboxOption as HeadlessListboxOption,
  ComboboxOption as HeadlessComboboxOption
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function ListboxOrComboboxOption({
  value,
  text,
  icon,
  color,
  type = 'listbox',
  matchedSubstrings
}: {
  value: string | number | Record<string, any>
  text: string
  icon?: string
  color?: string
  type?: 'listbox' | 'combobox'
  matchedSubstrings?: Array<{ length: number; offset: number }>
}): React.ReactElement {
  const Element =
    type === 'listbox' ? HeadlessListboxOption : HeadlessComboboxOption

  return (
    <Element
      className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
      value={value}
    >
      {({ selected }: { selected: boolean }) => (
        <>
          <div
            className={`flex items-center ${
              color !== undefined ? 'gap-4' : 'gap-2'
            } ${selected ? 'font-semibold text-bg-800 dark:text-bg-100' : ''}`}
          >
            {icon !== undefined ? (
              <span
                className={`rounded-md ${color !== undefined ? 'p-2' : 'pr-2'}`}
                style={
                  color !== undefined
                    ? {
                        backgroundColor: color + '20',
                        color
                      }
                    : {}
                }
              >
                <Icon icon={icon} className="size-5" />
              </span>
            ) : (
              color !== undefined && (
                <span
                  className="block h-6 w-1 rounded-full border border-bg-200 dark:border-bg-700"
                  style={{ backgroundColor: color }}
                />
              )
            )}
            <span>
              {text.split('').map((char, index) => (
                <span
                  key={index}
                  className={
                    matchedSubstrings !== undefined
                      ? matchedSubstrings.some(
                          ({ offset, length }) =>
                            index >= offset && index < offset + length
                        )
                        ? 'font-medium text-bg-800 dark:text-bg-100'
                        : ''
                      : ''
                  }
                >
                  {char}
                </span>
              ))}
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
    </Element>
  )
}

export default ListboxOrComboboxOption
