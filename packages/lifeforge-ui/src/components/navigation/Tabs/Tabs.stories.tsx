import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import { Box } from '@components/primitives'

import Tabs from '../Tabs'

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
      <Box width="60vw">
        <Tabs
          currentTab={currentTab}
          enabled={['overview', 'settings', 'profile']}
          items={BASIC_TABS}
          onTabChange={setCurrentTab}
        />
      </Box>
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
      <Box width="60vw">
        <Tabs
          currentTab={active}
          enabled={['all', 'active', 'completed', 'archived']}
          items={TABS_WITH_AMOUNTS}
          onTabChange={setActive}
        />
      </Box>
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
      <Box width="60vw">
        <Tabs
          currentTab={active}
          enabled={['red', 'green', 'blue']}
          items={COLORED_TABS}
          onTabChange={setActive}
        />
      </Box>
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
      <Box width="60vw">
        <Tabs
          currentTab={active}
          enabled={['overview', 'settings', 'profile']}
          items={BASIC_TABS}
          onTabChange={setActive}
        />
      </Box>
    )
  }
}

/**
 * A large number of tabs to demonstrate horizontal scrolling behavior.
 */
export const ALotOfTabs: Story = {
  args: {
    items: [],
    enabled: [],
    currentTab: 'tab1',
    onTabChange: () => {}
  },
  render: () => {
    const [active, setActive] = useState<string>('tab1')

    return (
      <Box width="60vw">
        <Tabs
          currentTab={active}
          enabled={Array.from({ length: 20 }, (_, i) => `tab${i + 1}`)}
          items={Array.from({ length: 20 }, (_, i) => ({
            id: `tab${i + 1}`,
            name: `Tab ${i + 1}`,
            icon: 'tabler:star'
          }))}
          onTabChange={setActive}
        />
      </Box>
    )
  }
}
