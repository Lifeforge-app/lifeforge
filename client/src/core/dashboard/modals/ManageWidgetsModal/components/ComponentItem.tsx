import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { type IDashboardLayout, usePersonalization } from '@lifeforge/shared'
import {
  Card,
  Flex,
  Icon,
  Stack,
  Switch,
  Text,
  Transition,
  colorWithOpacity
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

function ComponentListItem({
  id,
  icon,
  minW,
  minH,
  maxW,
  maxH,
  namespace
}: {
  id: string
  icon: string
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  namespace?: string
}) {
  const { t } = useTranslation([namespace ?? 'common.dashboard'])

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
            maxW: maxW ?? 8,
            maxH: maxH ?? 8,
            i: id
          }
        ]
      }
      setDashboardLayout(newEnabledWidgets)

      return
    }

    for (const breakpoint of ['lg', 'md', 'sm', 'xs', 'xxs']) {
      newEnabledWidgets[breakpoint] = newEnabledWidgets[breakpoint] ?? []
      newEnabledWidgets[breakpoint].push({
        x: 0,
        y: Infinity,
        w: minW || maxW || 4,
        h: minH || maxH || 4,
        minW: minW ?? 1,
        minH: minH ?? 1,
        maxW: maxW ?? 8,
        maxH: maxH ?? 8,
        i: id
      })
    }

    setEnabledWidgets(newEnabledWidgets)
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
  }

  function toggleComponent() {
    if (isEnabled) {
      removeComponent()

      return
    }

    addComponent()
  }

  return (
    <Card
      shadow
      align="center"
      as="li"
      bg={{
        base: 'bg-50',
        dark: colorWithOpacity('bg-800', '50%')
      }}
      direction="row"
      gap="xl"
      justify="between"
      onClick={toggleComponent}
    >
      <Flex align="center" gap="md">
        <Transition>
          <Flex
            centered
            bg={
              isEnabled
                ? colorWithOpacity('custom-500', '10%')
                : {
                    base: 'bg-200',
                    dark: colorWithOpacity('bg-700', '50%')
                  }
            }
            flexShrink="0"
            height="3em"
            r="lg"
            width="3em"
          >
            <Icon
              color={isEnabled ? 'custom-500' : 'bg-500'}
              icon={icon}
              size="1.5em"
            />
          </Flex>
        </Transition>
        <Stack gap="none">
          <Text as="h3" weight="semibold">
            {t([
              `widgets.${namespace}.${id}.title`,
              `widgets.${id}.title`,
              `widgets.${namespace}.${id}`,
              `widgets.${id}`,
              id
            ])}
          </Text>
          <Text color="muted" size="sm">
            {t([
              `widgets.${namespace}.${id}.description`,
              `widgets.${id}.description`
            ])}
          </Text>
        </Stack>
      </Flex>
      <Switch
        value={isEnabled}
        onChange={() => {
          toggleComponent()
        }}
      />
    </Card>
  )
}

export default ComponentListItem
