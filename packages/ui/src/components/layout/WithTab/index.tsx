import type React from 'react'
import { createContext, useContext } from 'react'

import { Tabs as TabsComponent } from '@/components/navigation'
import useNuqsOrBasicState from '@/hooks/useNuqsOrBasicState'

interface TabContextValues<TTab extends string = string> {
  Tab: (props: { tabId: TTab; children: React.ReactNode }) => React.ReactNode
  TabSelector: () => React.ReactNode
  currentTab: TTab
  setCurrentTab: (tab: TTab) => void
}

interface WithTabProps<
  TTabItems extends ReadonlyArray<{
    id: string
    name: string
    icon?: string
    color?: string
    amount?: number | ((currentTab: string) => number)
  }>
> {
  children: ({
    Tab,
    TabSelector,
    currentTab,
    setCurrentTab
  }: TabContextValues<TTabItems[number]['id']>) => React.ReactElement
  tabs: TTabItems
  useNuqs?: boolean
  defaultValue?: TTabItems[number]['id']
  currentTab?: TTabItems[number]['id']
  onTabChange?: (tab: TTabItems[number]['id']) => void
  enabled?: readonly TTabItems[number]['id'][]
  selectorProps?: Omit<
    React.ComponentProps<typeof TabsComponent>,
    'items' | 'currentTab' | 'onTabChange' | 'enabled'
  >
}

const TabContext = createContext<TabContextValues | undefined>(undefined)

export function useTabContext<
  TValue extends string
>(): TabContextValues<TValue> {
  const context = useContext(TabContext)

  if (!context) {
    throw new Error('useTabContext must be used inside a WithTab component')
  }

  return context as unknown as TabContextValues<TValue>
}

function TabComponent<TTabId extends string>({
  children,
  tabId
}: {
  tabId: TTabId
  children: React.ReactNode
}) {
  const { currentTab: selectedTab } = useTabContext()

  if (tabId !== selectedTab) return

  return children
}

export function WithTab<
  const TTabItems extends ReadonlyArray<{
    id: string
    name: string
    icon?: string
    color?: string
    amount?: number | ((currentTab: string) => number)
  }>
>({
  children,
  tabs,
  defaultValue,
  useNuqs = true,
  currentTab: controlledTab,
  onTabChange: controlledOnTabChange,
  enabled,
  selectorProps
}: WithTabProps<TTabItems>) {
  const tabValues = tabs.map(t => t.id)

  const [currentTab, setCurrentTab] = useNuqsOrBasicState<
    TTabItems[number]['id']
  >({
    options: tabValues,
    useNuqs: useNuqs ? 'tab' : false,
    defaultValue,
    controlled: {
      value: controlledTab || null,
      setValue: controlledOnTabChange || null
    }
  })

  function BoundTabSelector() {
    return (
      <TabsComponent<TTabItems, TTabItems[number]['id']>
        currentTab={currentTab}
        enabled={enabled ?? tabValues}
        items={tabs}
        onTabChange={setCurrentTab}
        {...selectorProps}
      />
    )
  }

  const contextValues: TabContextValues<TTabItems[number]['id']> = {
    Tab: TabComponent,
    TabSelector: BoundTabSelector,
    currentTab,
    setCurrentTab
  }

  return (
    <TabContext value={contextValues}>{children(contextValues)}</TabContext>
  )
}
