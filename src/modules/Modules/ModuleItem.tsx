import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button, Switch } from '@components/buttons'
import { TextInput } from '@components/inputs'
import useThemeColors from '@hooks/useThemeColor'
import {
  type IModuleConfigInput,
  type IModuleConfigSelect,
  type IModuleConfigSwitch,
  type IModuleEntry
} from '@interfaces/module_interfaces'
import { useAuthContext } from '@providers/AuthProvider'
import { toCamelCase } from '@utils/strings'

function ModuleItem({
  module,
  enabled,
  toggleModule
}: {
  module: IModuleEntry
  enabled: boolean
  toggleModule: (moduleName: string) => void
}): React.ReactElement {
  const { componentBg, componentBgLighter } = useThemeColors()
  const [expandConfig, setExpandConfig] = useState(false)
  const { t } = useTranslation(`modules.${toCamelCase(module.name)}`)
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
      className={`flex flex-col items-center rounded-lg p-4 shadow-custom ${componentBg}`}
    >
      <div className="flex-between flex w-full gap-4">
        <div className="flex items-center gap-4">
          <div className={`rounded-lg p-3 ${componentBgLighter}`}>
            <Icon
              className="text-2xl text-custom-500 dark:text-bg-50"
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
            className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800/50"
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
        className={`flex w-full flex-col rounded-lg transition-all ${
          expandConfig
            ? 'mt-4 max-h-96 overflow-y-auto py-4'
            : 'max-h-0 overflow-hidden py-0'
        }`}
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
                        updateValue={() => {}}
                        value={''}
                      />
                    )
                  case 'select':
                    return (
                      <div key={key} className="space-y-2">
                        <label className="text-sm text-bg-500" htmlFor={key}>
                          {property.name}
                        </label>
                        <select
                          className="rounded-lg bg-bg-100 p-2 dark:bg-bg-800"
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
