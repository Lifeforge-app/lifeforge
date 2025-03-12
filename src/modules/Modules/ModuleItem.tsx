import { Icon } from '@iconify/react'
import { useAuthContext } from '@providers/AuthProvider'
import clsx from 'clsx'
import _ from 'lodash'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, Switch, TextInput } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import {
  type IModuleConfigInput,
  type IModuleConfigSelect,
  type IModuleConfigSwitch,
  type IModuleEntry
} from './interfaces/module_interfaces'

function ModuleItem({
  module,
  enabled,
  toggleModule
}: {
  module: IModuleEntry
  enabled: boolean
  toggleModule: (moduleName: string) => void
}): React.ReactElement {
  const { componentBg, componentBgLighter } = useComponentBg()
  const [expandConfig, setExpandConfig] = useState(false)
  const { t } = useTranslation(`modules.${_.camelCase(module.name)}`)
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
    <li
      className={clsx(
        'shadow-custom flex flex-col items-center rounded-lg p-4',
        componentBg
      )}
    >
      <div className="flex-between flex w-full gap-4">
        <div className="flex items-center gap-4">
          <div className={clsx('rounded-lg p-3', componentBgLighter)}>
            <Icon
              className="text-custom-500 dark:text-bg-50 text-2xl"
              icon={module.icon}
            />
          </div>
          <div>
            <h3 className="flex flex-wrap items-center gap-2 text-xl font-medium">
              <span>{t('title')}</span>
              <span>
                {module.deprecated && (
                  <span className="text-sm text-red-500">
                    ({t('modules.deprecated')})
                  </span>
                )}
              </span>
            </h3>
            <p className="text-bg-500">{t('description')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Switch
            checked={enabled}
            onChange={() => {
              toggleModule(module.name)
            }}
          />
          <button
            className="text-bg-500 hover:bg-bg-200 dark:hover:bg-bg-800/50 rounded-lg p-2 transition-all"
            onClick={toggleExpandConfig}
          >
            <Icon
              className="text-xl"
              icon={
                expandConfig ? 'tabler:chevron-down' : 'tabler:chevron-right'
              }
            />
          </button>
        </div>
      </div>
      <form
        autoComplete="off"
        className={clsx(
          'flex w-full flex-col rounded-lg transition-all',
          expandConfig
            ? 'mt-4 max-h-96 overflow-y-auto py-4'
            : 'max-h-0 overflow-hidden py-0'
        )}
      >
        <input hidden type="text" />
        <input hidden type="password" />

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
                      <TextInput
                        key={key}
                        darker
                        noAutoComplete
                        icon={property.icon}
                        isPassword={property.isPassword}
                        name={property.name}
                        namespace="modules.modules"
                        placeholder={property.placeholder}
                        setValue={() => {}}
                        value={''}
                      />
                    )
                  case 'select':
                    return (
                      <div key={key} className="space-y-2">
                        <label className="text-bg-500 text-sm" htmlFor={key}>
                          {property.name}
                        </label>
                        <select
                          className="bg-bg-100 dark:bg-bg-800 rounded-lg p-2"
                          id={key}
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
                      <div key={key} className="flex-between flex gap-4">
                        <div>
                          <label className="text-lg font-medium" htmlFor={key}>
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
                        />
                      </div>
                    )
                }
              })()
          )}
        {originalModuleConfig !== JSON.stringify(userData.moduleConfigs) && (
          <Button
            className="mt-6"
            icon={!saveLoading ? 'uil:save' : 'svg-spinners:180-ring'}
            loading={saveLoading}
            onClick={saveConfig}
          >
            {!saveLoading ? 'Save' : ''}
          </Button>
        )}
      </form>
    </li>
  )
}

export default ModuleItem
