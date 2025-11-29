import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import Tabs from './Tabs'

const meta = {
  component: Tabs,
  argTypes: {
    onTabChange: {
      control: false
    },
    items: {
      control: false
    }
  }
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

const BASIC_TABS = [
  { id: 'overview', name: 'Overview', icon: 'tabler:home' },
  { id: 'settings', name: 'Settings', icon: 'tabler:settings' },
  { id: 'profile', name: 'Profile', icon: 'tabler:user' }
] as const

/**
 * A simple tabs component for navigation between sections.
 */
export const Default: Story = {
  args: {
    items: BASIC_TABS,
    enabled: ['overview', 'settings', 'profile'],
    currentTab: 'overview',
    onTabChange: () => {}
  },
  render: () => {
    const [currentTab, setCurrentTab] = useState<
      'overview' | 'settings' | 'profile'
    >('overview')

    return (
      <div className="w-[60vw]">
        <Tabs
          currentTab={currentTab}
          enabled={['overview', 'settings', 'profile']}
          items={BASIC_TABS}
          onTabChange={setCurrentTab}
        />
      </div>
    )
  }
}

const TABS_WITH_AMOUNTS = [
  { id: 'all', name: 'All', icon: 'tabler:list', amount: 187 },
  { id: 'active', name: 'Active', icon: 'tabler:check', amount: 69 },
  {
    id: 'completed',
    name: 'Completed',
    icon: 'tabler:circle-check',
    amount: 33
  },
  { id: 'archived', name: 'Archived', icon: 'tabler:archive', amount: 85 }
] as const

/**
 * Tabs with item counts displayed.
 */
export const WithAmounts: Story = {
  args: {
    items: TABS_WITH_AMOUNTS,
    enabled: ['all', 'active', 'completed', 'archived'],
    currentTab: 'all',
    onTabChange: () => {}
  },
  render: () => {
    const [active, setActive] = useState<
      'all' | 'active' | 'completed' | 'archived'
    >('all')

    return (
      <div className="w-[60vw]">
        <Tabs
          currentTab={active}
          enabled={['all', 'active', 'completed', 'archived']}
          items={TABS_WITH_AMOUNTS}
          onTabChange={setActive}
        />
      </div>
    )
  }
}

const COLORED_TABS = [
  { id: 'red', name: 'Red', icon: 'tabler:palette', color: colors.red[500] },
  {
    id: 'green',
    name: 'Green',
    icon: 'tabler:palette',
    color: colors.green[500]
  },
  { id: 'blue', name: 'Blue', icon: 'tabler:palette', color: colors.blue[500] }
] as const

/**
 * Tabs with custom colors.
 */
export const WithColors: Story = {
  args: {
    items: COLORED_TABS,
    enabled: ['red', 'green', 'blue'],
    currentTab: 'red',
    onTabChange: () => {}
  },
  render: () => {
    const [active, setActive] = useState<'red' | 'green' | 'blue'>('red')

    return (
      <div className="w-[60vw]">
        <Tabs
          currentTab={active}
          enabled={['red', 'green', 'blue']}
          items={COLORED_TABS}
          onTabChange={setActive}
        />
      </div>
    )
  }
}

/**
 * Tabs with only some items enabled.
 */
export const PartiallyEnabled: Story = {
  args: {
    items: BASIC_TABS,
    enabled: ['overview', 'profile'],
    currentTab: 'overview',
    onTabChange: () => {}
  },
  render: () => {
    const [active, setActive] = useState<'overview' | 'settings' | 'profile'>(
      'overview'
    )

    return (
      <div className="w-[60vw]">
        <Tabs
          currentTab={active}
          enabled={['overview', 'settings', 'profile']}
          items={BASIC_TABS}
          onTabChange={setActive}
        />
      </div>
    )
  }
}
