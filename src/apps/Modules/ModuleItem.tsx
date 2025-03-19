import { Icon } from '@iconify/react'
import clsx from 'clsx'
import _ from 'lodash'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Switch } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { RouteItem } from '../../core/layout/interfaces/routes_interfaces'

function ModuleItem({
  module,
  enabled,
  toggleModule
}: {
  module: RouteItem
  enabled: boolean
  toggleModule: (moduleName: string) => void
}) {
  const { componentBg, componentBgLighter } = useComponentBg()
  const [expandConfig, setExpandConfig] = useState(false)
  const { t } = useTranslation(`apps.${_.camelCase(module.name)}`)

  function toggleExpandConfig() {
    setExpandConfig(!expandConfig)
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
    </li>
  )
}

export default ModuleItem
