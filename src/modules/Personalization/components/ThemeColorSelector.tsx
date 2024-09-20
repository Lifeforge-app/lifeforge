/* eslint-disable tailwindcss/no-custom-classname */
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
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
  const [customThemeColor, setCustomThemeColor] = useState<string>(
    themeColor.startsWith('#') ? themeColor : '#000000'
  )
  const [colorPickerModalOpen, setColorPickerModalOpen] =
    useState<boolean>(false)
  const { t } = useTranslation()

  function updateCustomThemeColor(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setCustomThemeColor(e.target.value)
  }

  return (
    <ConfigColumn
      title={t('personalization.themeColorSelector.title')}
      desc={t('personalization.themeColorSelector.desc')}
      icon="tabler:palette"
    >
      <Listbox
        value={themeColor.startsWith('#') ? 'theme-custom' : themeColor}
        onChange={color => {
          setThemeColor(color === 'theme-custom' ? customThemeColor : color)
        }}
      >
        <div className="relative mt-1 w-full md:w-56">
          <ListboxButton
            className={`flex w-full items-center gap-2 rounded-lg border-[1.5px] border-bg-300/50 ${
              !themeColor.startsWith('#')
                ? 'py-4 pl-4 pr-10'
                : 'py-6 pl-6 pr-12'
            } text-left outline-none transition-all hover:bg-bg-100 focus:outline-none dark:border-bg-700 dark:bg-bg-900 dark:hover:bg-bg-800/70`}
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
            className="h-64 w-80 divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base text-bg-800 shadow-lg transition duration-100 ease-out [--anchor-gap:8px] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-bg-800 dark:border-bg-700 dark:bg-bg-900 dark:text-bg-50"
          >
            {COLORS.map(color => (
              <ListboxOption
                key={color}
                className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-100 hover:dark:bg-bg-800"
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
              className="flex-between relative flex cursor-pointer select-none bg-transparent p-4 transition-all hover:bg-bg-100 hover:dark:bg-bg-800"
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
      {themeColor.startsWith('#') && (
        <>
          <ColorInput
            className="w-min"
            name="Color Hex"
            color={customThemeColor}
            updateColor={updateCustomThemeColor}
            setColorPickerOpen={setColorPickerModalOpen}
            hasTopMargin={false}
          />
          {themeColor !== customThemeColor &&
            customThemeColor.match(/^#[0-9A-F]{6}$/i) !== null && (
              <Button
                icon="uil:save"
                onClick={() => {
                  setThemeColor(customThemeColor)
                }}
              />
            )}
          <ColorPickerModal
            color={customThemeColor}
            setColor={setCustomThemeColor}
            isOpen={colorPickerModalOpen}
            setOpen={setColorPickerModalOpen}
          />
        </>
      )}
    </ConfigColumn>
  )
}

export default ThemeColorSelector
