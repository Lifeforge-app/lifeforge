import { ModuleConfig } from '@core/routes/interfaces/routes_interfaces'
import { Icon } from '@iconify/react'
import { Switch } from 'lifeforge-ui'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function ModuleItem({
  module,
  enabled,
  toggleModule
}: {
  module: ModuleConfig
  enabled: boolean
  toggleModule: (moduleName: string) => void
}) {
  const [expandConfig, setExpandConfig] = useState(false)

  const { t } = useTranslation(`apps.${_.camelCase(module.name)}`)

  function toggleExpandConfig() {
    setExpandConfig(!expandConfig)
  }

  return (
    <li className="shadow-custom component-bg flex flex-col items-center rounded-lg p-4">
      <div className="flex-between flex w-full gap-3">
        <div className="flex items-center gap-3">
          <div className="component-bg-lighter rounded-lg p-3">
            {typeof module.icon === 'string' ? (
              <Icon
                className="text-custom-500 dark:text-bg-50 text-2xl"
                icon={module.icon}
              />
            ) : (
              module.icon
            )}
          </div>
          <div>
            <h3 className="flex flex-wrap items-center gap-2 text-xl font-medium">
              <span>{t('title')}</span>
            </h3>
            <p className="text-bg-500">{t('description')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
    </li>
  )
}

export default ModuleItem
