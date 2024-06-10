/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Switch } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { toCamelCase } from '@utils/strings'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import { useAuthContext } from '@providers/AuthProvider'
import {
  type IModuleConfigSelect,
  type IModuleConfigSwitch,
  type IModuleConfigInput,
  type IModuleEntry
} from '@typedec/Module'

function ModuleItem({
  module,
  enabled,
  toggleModule
}: {
  module: IModuleEntry
  enabled: boolean
  toggleModule: (moduleName: string) => void
}): React.ReactElement {
  const [expandConfig, setExpandConfig] = useState(false)
  const { t } = useTranslation()
  const [saveLoading, setButtonLoading] = useState(false)

  function toggleExpandConfig(): void {
    setExpandConfig(!expandConfig)
  }
  const { userData, setUserData } = useAuthContext()

  const [originalModuleConfig, setOriginalModuleConfig] = useState(
    JSON.stringify(userData.moduleConfigs)
  )

  const [moduleConfig, setModuleConfig] = useState(
    Object.assign({}, userData.moduleConfigs)
  )

  function saveConfig(): void {
    setButtonLoading(true)
    fetch(`${import.meta.env.VITE_API_HOST}/user/module/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        id: userData.id,
        data: moduleConfig
      })
    })
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info('Module configuration saved successfully.')
          setUserData({ ...userData, moduleConfigs: moduleConfig })
          setOriginalModuleConfig(JSON.stringify(moduleConfig))
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(
          "Oops! Couldn't save the module configuration. Please try again."
        )
        console.error(err)
      })
      .finally(() => {
        setButtonLoading(false)
      })
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
              } inline-block size-4 rounded-full transition`}
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
            ([key, property]: [
              string,
              IModuleConfigInput | IModuleConfigSelect | IModuleConfigSwitch
            ]) =>
              (() => {
                const { type } = property
                switch (type) {
                  case 'input':
                    return (
                      <Input
                        key={key}
                        icon={property.icon}
                        name={property.name}
                        placeholder={property.placeholder}
                        value={''}
                        updateValue={() => {}}
                        darker
                        isPassword={property.isPassword}
                        noAutoComplete
                      />
                    )
                  case 'select':
                    return (
                      <div key={key} className="flex flex-col gap-2">
                        <label htmlFor={key} className="text-sm text-bg-500">
                          {property.name}
                        </label>
                        <select
                          id={key}
                          className="rounded-lg bg-bg-100 p-2 dark:bg-bg-800"
                        >
                          {property.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )
                  case 'switch':
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-4"
                      >
                        <div>
                          <label htmlFor={key} className="text-lg font-medium">
                            {property.name}
                          </label>
                          <p className="text-bg-500">{property.description}</p>
                        </div>
                        <Switch
                          checked={moduleConfig[module.name][key]}
                          onChange={() => {
                            moduleConfig[module.name][key] =
                              !moduleConfig[module.name][key]
                            setModuleConfig({ ...moduleConfig })
                          }}
                          className={`${
                            moduleConfig[module.name][key]
                              ? 'bg-custom-500'
                              : 'bg-bg-300 dark:bg-bg-800'
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span
                            className={`${
                              moduleConfig[module.name][key]
                                ? 'translate-x-6 bg-bg-100'
                                : 'translate-x-1 bg-bg-100 dark:bg-bg-500'
                            } inline-block size-4 rounded-full transition`}
                          />
                        </Switch>
                      </div>
                    )
                }
              })()
          )}
        {originalModuleConfig !== JSON.stringify(userData.moduleConfigs) && (
          <Button
            disabled={saveLoading}
            onClick={saveConfig}
            className="mt-6"
            icon={!saveLoading ? 'uil:save' : 'svg-spinners:180-ring'}
          >
            {!saveLoading && 'Save'}
          </Button>
        )}
      </form>
    </li>
  )
}

export default ModuleItem
