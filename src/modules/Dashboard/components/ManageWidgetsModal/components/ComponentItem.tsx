import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Switch from '@components/ButtonsAndInputs/Switch'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'

function ComponentListItem({
  id,
  icon,
  minW,
  minH,
  setReady
}: {
  id: string
  icon: string
  minW?: number
  minH?: number
  setReady: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()
  const {
    dashboardLayout: enabledWidgets,
    setDashboardLayout,
    setDashboardLayoutWithoutPost: setEnabledWidgets
  } = usePersonalizationContext()

  const isEnabled = useMemo(() => {
    return Object.values(
      JSON.stringify(enabledWidgets) !== '{}' ? enabledWidgets : { a: [] }
    ).some(e => e.find(i => i.i === id) !== undefined)
  }, [enabledWidgets, id])

  function addComponent(): void {
    const newEnabledWidgets = { ...enabledWidgets }

    if (Object.keys(newEnabledWidgets).length === 0) {
      for (const breakpoint of ['lg', 'md', 'sm', 'xs', 'xxs']) {
        newEnabledWidgets[breakpoint] = [
          {
            x: 0,
            y: 0,
            w: 4,
            h: 4,
            minW: minW ?? 1,
            minH: minH ?? 1,
            i: id
          }
        ]
      }
      setEnabledWidgets(newEnabledWidgets)
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

  function removeComponent(): void {
    const newEnabledWidgets = Object.fromEntries(
      Object.entries({ ...enabledWidgets }).map(([k, value]) => [
        k,
        value.filter(i => i.i !== id)
      ])
    )
    setDashboardLayout(newEnabledWidgets)
    if (Object.values(newEnabledWidgets).every(e => e.length === 0)) {
      setDashboardLayout({})
    }

    setTimeout(() => {
      setReady(true)
    }, 100)
  }

  function toggleComponent(): void {
    setReady(false)

    if (isEnabled) {
      removeComponent()
      return
    }

    addComponent()
  }

  return (
    <li className="flex-between flex gap-8 rounded-lg bg-bg-50 p-4 shadow-custom dark:bg-bg-800/50">
      <div className="flex items-center gap-4">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-all ${
            Object.keys(enabledWidgets).includes(id)
              ? 'bg-custom-500/20 text-custom-500'
              : 'bg-bg-200 text-bg-400 dark:bg-bg-700/50 dark:text-bg-500'
          }`}
        >
          <Icon icon={icon} className="size-6" />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold">
            {t(`dashboard.widgets.${id}.title`)}
          </div>
          <div className="text-sm text-bg-500">
            {t(`dashboard.widgets.${id}.description`)}
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
