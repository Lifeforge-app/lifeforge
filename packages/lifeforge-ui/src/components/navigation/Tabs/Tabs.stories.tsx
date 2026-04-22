import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import colors from 'tailwindcss/colors'

import { Box } from '@components/primitives'

import Tabs from '../Tabs'

const meta = {
  argTypes: {
    items: {
      control: false
    },
    onTabChange: {
      control: false
    }
  },
  component: Tabs
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

const BASIC_TABS = [
  { icon: 'tabler:home', id: 'overview', name: 'Overview' },
  { icon: 'tabler:settings', id: 'settings', name: 'Settings' },
  { icon: 'tabler:user', id: 'profile', name: 'Profile' }
] as const

/**
 * A simple tabs component for navigation between sections.
 */
export const Default: Story = {
  args: {
    currentTab: 'overview',
    enabled: ['overview', 'settings', 'profile'],
    items: BASIC_TABS,
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
  { amount: 187, icon: 'tabler:list', id: 'all', name: 'All' },
  { amount: 69, icon: 'tabler:check', id: 'active', name: 'Active' },
  {
    amount: 33,
    icon: 'tabler:circle-check',
    id: 'completed',
    name: 'Completed'
  },
  { amount: 85, icon: 'tabler:archive', id: 'archived', name: 'Archived' }
] as const

/**
 * Tabs with item counts displayed.
 */
export const WithAmounts: Story = {
  args: {
    currentTab: 'all',
    enabled: ['all', 'active', 'completed', 'archived'],
    items: TABS_WITH_AMOUNTS,
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
  { color: colors.red[500], icon: 'tabler:palette', id: 'red', name: 'Red' },
  {
    color: colors.green[500],
    icon: 'tabler:palette',
    id: 'green',
    name: 'Green'
  },
  { color: colors.blue[500], icon: 'tabler:palette', id: 'blue', name: 'Blue' }
] as const

/**
 * Tabs with custom colors.
 */
export const WithColors: Story = {
  args: {
    currentTab: 'red',
    enabled: ['red', 'green', 'blue'],
    items: COLORED_TABS,
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
    currentTab: 'overview',
    enabled: ['overview', 'profile'],
    items: BASIC_TABS,
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
    currentTab: 'tab1',
    enabled: [],
    items: [],
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
            icon: 'tabler:star',
            id: `tab${i + 1}`,
            name: `Tab ${i + 1}`
          }))}
          onTabChange={setActive}
        />
      </Box>
    )
  }
}
