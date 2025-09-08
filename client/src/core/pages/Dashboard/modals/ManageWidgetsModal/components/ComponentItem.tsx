import { Icon } from '@iconify/react'
import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import clsx from 'clsx'
import { Switch } from 'lifeforge-ui'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type IDashboardLayout, usePersonalization } from 'shared'

function ComponentListItem({
  id,
  icon,
  minW,
  minH,
  namespace,
  setReady
}: {
  id: string
  icon: string
  minW?: number
  minH?: number
  namespace?: string
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation(namespace ?? 'core.dashboard')

  const {
    dashboardLayout: enabledWidgets,
    setDashboardLayout: setEnabledWidgets
  } = usePersonalization()

  const { changeDashboardLayout: setDashboardLayout } = useUserPersonalization()

  const isEnabled = useMemo(() => {
    return Object.values(
      JSON.stringify(enabledWidgets) !== '{}' ? enabledWidgets : { a: [] }
    ).some(e => e.find(i => i.i === id) !== undefined)
  }, [enabledWidgets, id])

  function addComponent() {
    const newEnabledWidgets = JSON.parse(JSON.stringify(enabledWidgets))

    if (Object.keys(newEnabledWidgets).length === 0) {
      for (const breakpoint of ['lg', 'md', 'sm', 'xs', 'xxs']) {
        newEnabledWidgets[breakpoint] = [
          {
            x: 0,
            y: 0,
            w: minW ?? 4,
            h: minH ?? 4,
            minW: minW ?? 1,
            minH: minH ?? 1,
            i: id
          }
        ]
      }
      setDashboardLayout(newEnabledWidgets)
      setTimeout(() => {
        setReady(true)
      }, 100)

      return
    }

    for (const breakpoint of ['lg', 'md', 'sm', 'xs', 'xxs']) {
      newEnabledWidgets[breakpoint] = newEnabledWidgets[breakpoint] ?? []
      newEnabledWidgets[breakpoint].push({
        x: 0,
        y: Infinity,
        w: 4,
        h: 4,
        minW: minW ?? 1,
        minH: minH ?? 1,
        i: id
      })
    }

    setEnabledWidgets(newEnabledWidgets)

    setTimeout(() => {
      setReady(true)
    }, 100)
  }

  function removeComponent() {
    const newEnabledWidgets = Object.fromEntries(
      Object.entries(
        JSON.parse(JSON.stringify(enabledWidgets)) as IDashboardLayout
      ).map(([k, value]) => [k, value.filter(i => i.i !== id)])
    )

    if (Object.values(newEnabledWidgets).every(e => e.length === 0)) {
      setDashboardLayout({})
    } else {
      setDashboardLayout(newEnabledWidgets)
    }

    setTimeout(() => {
      setReady(true)
    }, 100)
  }

  function toggleComponent() {
    setReady(false)

    if (isEnabled) {
      removeComponent()

      return
    }

    addComponent()
  }

  return (
    <li className="flex-between bg-bg-50 shadow-custom dark:bg-bg-800/50 flex gap-8 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div
          className={clsx(
            'flex size-10 shrink-0 items-center justify-center rounded-lg transition-all',
            Object.keys(enabledWidgets).includes(id)
              ? 'bg-custom-500/20 text-custom-500'
              : 'bg-bg-200 text-bg-400 dark:bg-bg-700/50 dark:text-bg-500'
          )}
        >
          <Icon className="size-6" icon={icon} />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">
            {t([`widgets.${id}.title`, `widgets.${id}`, id])}
          </div>
          <div className="text-bg-500 text-sm">
            {t(`widgets.${id}.description`)}
          </div>
        </div>
      </div>
      <Switch
        checked={isEnabled}
        onChange={() => {
          toggleComponent()
        }}
      />
    </li>
  )
}

export default ComponentListItem
