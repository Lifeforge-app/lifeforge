/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Input from '@components/Input'
import { type ModuleEntry } from '@typedec/Module'
import { toCamelCase } from '../../utils/strings'

function ModuleItem({
  module,
  enabled,
  toggleModule
}: {
  module: ModuleEntry
  enabled: boolean
  toggleModule: (moduleName: string) => void
}): React.ReactElement {
  const [expandConfig, setExpandConfig] = useState(false)
  const { t } = useTranslation()

  function toggleExpandConfig(): void {
    setExpandConfig(!expandConfig)
  }

  return (
    <li className="flex flex-col items-center rounded-lg bg-bg-50 p-4 dark:bg-bg-900">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-custom-500/20 p-3 dark:bg-bg-800">
            <Icon
              icon={module.icon}
              className="text-2xl text-custom-500 dark:text-bg-100"
            />
          </div>
          <h3 className="text-xl font-semibold">
            {t(`modules.${toCamelCase(module.name)}`)}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <Switch
            checked={enabled}
            onChange={() => {
              toggleModule(module.name)
            }}
            className={`${
              enabled ? 'bg-custom-500' : 'bg-bg-300 dark:bg-bg-800'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                enabled
                  ? 'translate-x-6 bg-bg-100'
                  : 'translate-x-1 bg-bg-100 dark:bg-bg-500'
              } inline-block h-4 w-4 rounded-full transition`}
            />
          </Switch>
          <button
            onClick={toggleExpandConfig}
            className="rounded-lg p-2 text-bg-500 hover:bg-bg-800/50"
          >
            <Icon
              icon={
                expandConfig ? 'tabler:chevron-down' : 'tabler:chevron-right'
              }
              className="text-xl"
            />
          </button>
        </div>
      </div>
      <form
        autoComplete="off"
        className={`flex w-full flex-col rounded-lg transition-all ${
          expandConfig
            ? 'mt-4 max-h-96 overflow-y-auto py-4'
            : 'max-h-0 overflow-hidden py-0'
        }`}
      >
        <input type="text" hidden />
        <input type="password" hidden />

        {module.config &&
          Object.entries(module.config).map(
            ([key, { icon, name, placeholder, isPassword }]) => (
              <Input
                key={key}
                icon={icon}
                name={name}
                placeholder={placeholder}
                value={''}
                updateValue={() => {}}
                darker
                isPassword={isPassword}
                noAutoComplete
              />
            )
          )}
      </form>
    </li>
  )
}

export default ModuleItem
