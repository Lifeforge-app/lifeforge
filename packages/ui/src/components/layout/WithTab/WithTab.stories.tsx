/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react-vite'
import type React from 'react'
import { useState } from 'react'

import { EmptyStateScreen } from '@/components/feedback'
import { Checkbox } from '@/components/inputs'
import { Box, Flex, Grid, Icon, Text } from '@/components/primitives'

import { Card } from '../Card'
import { WithTab } from './index'

interface WithTabStoryProps {
  children: (...args: any[]) => React.ReactElement
  enabled?: readonly string[]
  useNuqs?: boolean
  selectorProps?: Record<string, unknown>
  tabs: ReadonlyArray<{
    amount?: number | ((currentTab: string) => number)
    color?: string
    icon?: string
    id: string
    name: string
  }>
}

const meta: Meta<WithTabStoryProps> = {
  argTypes: {
    children: {
      control: false
    },
    enabled: {
      control: false
    },
    selectorProps: {
      control: false
    },
    tabs: {
      control: false
    }
  },
  component: WithTab,
  title: 'Layout/WithTab'
}

export default meta

type Story = StoryObj<typeof meta>

const TABS = [
  { icon: 'tabler:list', id: 'all', name: 'All' },
  { icon: 'tabler:clock', id: 'pending', name: 'Pending' },
  { icon: 'tabler:check', id: 'done', name: 'Done' }
] as const

function TaskItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)

  return (
    <Card align="center" direction="row" gap="md">
      <Checkbox checked={checked} onCheckedChange={setChecked} />
      <Text>{label}</Text>
    </Card>
  )
}

/**
 * Basic tab switching using the `Tab` component for conditional rendering. Each tab
 * wraps its own content and only renders when that tab is selected.
 */
export const Default: Story = {
  args: {
    children: () => <></>,
    tabs: TABS
  },
  render: args => (
    <WithTab {...(args as any)} tabs={TABS}>
      {({ Tab, TabSelector }) => (
        <Box width="100%">
          <TabSelector />
          <Box mt="lg">
            <Tab tabId="all">
              <Flex direction="column" gap="md">
                <Card p="2xl">
                  <Text size="2xl" weight="bold">
                    Welcome back
                  </Text>
                  <Text color="muted" mt="xs">
                    You have 3 pending tasks and 2 completed.
                  </Text>
                </Card>
                <Grid gap="sm" templateCols={2}>
                  <Card align="center" gap="xs">
                    <Text color="muted" size="sm">
                      Pending
                    </Text>
                    <Text size="2xl" weight="bold">
                      3
                    </Text>
                  </Card>
                  <Card align="center" gap="xs">
                    <Text color="muted" size="sm">
                      Done
                    </Text>
                    <Text size="2xl" weight="bold">
                      2
                    </Text>
                  </Card>
                </Grid>
              </Flex>
            </Tab>
            <Tab tabId="pending">
              <Flex align="center" direction="column" gap="md">
                <Text size="xl" weight="semibold">
                  Pending Tasks
                </Text>
                <Flex direction="column" gap="sm" width="100%">
                  {[
                    'Review pull request',
                    'Write integration tests',
                    'Deploy to staging'
                  ].map(task => (
                    <TaskItem key={task} label={task} />
                  ))}
                </Flex>
              </Flex>
            </Tab>
            <Tab tabId="done">
              <EmptyStateScreen
                icon="tabler:check"
                message={{
                  description: 'Nothing left to do',
                  title: 'All done'
                }}
              />
            </Tab>
          </Box>
        </Box>
      )}
    </WithTab>
  )
}

interface Task {
  done: boolean
  label: string
}

const TASKS: readonly Task[] = [
  { done: false, label: 'Review pull request' },
  { done: false, label: 'Write integration tests' },
  { done: false, label: 'Deploy to staging' },
  { done: true, label: 'Buy groceries' },
  { done: true, label: 'Update dependencies' }
] as const

/**
 * Using the `selectedTab` variable to filter data. "All" shows every task,
 * "Pending" shows only incomplete tasks, and "Done" shows completed ones.
 */
export const WithSelectedTab: Story = {
  args: {
    children: () => <></>,
    tabs: TABS
  },
  render: args => (
    <WithTab {...(args as any)} tabs={TABS}>
      {({ currentTab, TabSelector }) => {
        const filtered =
          currentTab === 'all'
            ? TASKS
            : TASKS.filter(task => task.done === (currentTab === 'done'))

        return (
          <Box width="100%">
            <TabSelector />
            <Box mt="lg">
              <Flex direction="column" gap="sm">
                {filtered.length === 0 ? (
                  <EmptyStateScreen
                    smaller
                    icon="tabler:clipboard"
                    message={{ title: 'No tasks' }}
                  />
                ) : (
                  filtered.map(task => (
                    <TaskItem key={task.label} label={task.label} />
                  ))
                )}
              </Flex>
            </Box>
          </Box>
        )
      }}
    </WithTab>
  )
}

const TABS_WITH_AMOUNTS = [
  {
    amount: 12,
    id: 'unwatched',
    name: 'Unwatched'
  },
  {
    amount: 34,
    id: 'watched',
    name: 'Watched'
  },
  {
    amount: 3,
    color: '#eab308',
    id: 'watching',
    name: 'Watching'
  }
] as const

/**
 * Tabs with item counts. Useful for filtering lists by status with item counts.
 */
export const WithAmounts: Story = {
  args: {
    children: () => <></>,
    tabs: TABS_WITH_AMOUNTS
  },
  render: args => (
    <WithTab {...(args as any)} tabs={TABS_WITH_AMOUNTS}>
      {({ Tab, TabSelector }) => (
        <Box width="100%">
          <TabSelector />
          <Box mt="lg">
            <Tab tabId="unwatched">
              <Flex direction="column" gap="sm">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TaskItem key={i} label={`Unwatched entry #${i + 1}`} />
                ))}
              </Flex>
            </Tab>
            <Tab tabId="watched">
              <Flex direction="column" gap="sm">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TaskItem key={i} label={`Watched entry #${i + 1}`} />
                ))}
              </Flex>
            </Tab>
            <Tab tabId="watching">
              <Flex direction="column" gap="sm">
                {Array.from({ length: 3 }).map((_, i) => (
                  <TaskItem key={i} label={`Currently watching #${i + 1}`} />
                ))}
              </Flex>
            </Tab>
          </Box>
        </Box>
      )}
    </WithTab>
  )
}

const FILTERED_TABS = [
  { icon: 'tabler:circle', id: 'tab1', name: 'Tab One' },
  { icon: 'tabler:triangle', id: 'tab2', name: 'Tab Two' },
  { icon: 'tabler:square', id: 'tab3', name: 'Tab Three' }
] as const

/**
 * Using `enabled` to filter which tabs are shown. Here only Tab One and Tab Three are enabled.
 */
export const FilteredTabs: Story = {
  args: {
    children: () => <></>,
    enabled: ['tab1', 'tab3'],
    tabs: FILTERED_TABS
  },
  render: args => (
    <WithTab {...(args as any)} enabled={['tab1', 'tab3']} tabs={FILTERED_TABS}>
      {({ Tab, TabSelector }) => (
        <Box width="100%">
          <TabSelector />
          <Box mt="lg">
            <Tab tabId="tab1">
              <Flex direction="column" gap="sm">
                {['tab1'].map(id => (
                  <TaskItem key={id} label={id} />
                ))}
              </Flex>
            </Tab>
            <Tab tabId="tab3">
              <Flex direction="column" gap="sm">
                {['tab3'].map(id => (
                  <TaskItem key={id} label={id} />
                ))}
              </Flex>
            </Tab>
          </Box>
        </Box>
      )}
    </WithTab>
  )
}

const COLORED_TABS = [
  { color: '#ef4444', id: 'errors', name: 'Errors' },
  { color: '#eab308', id: 'warnings', name: 'Warnings' },
  { color: '#22c55e', id: 'success', name: 'Success' }
] as const

/**
 * Tabs with custom accent colors on the active tab underline.
 */
export const ColoredTabs: Story = {
  args: {
    children: () => <></>,
    tabs: COLORED_TABS
  },
  render: args => (
    <WithTab {...(args as any)} tabs={COLORED_TABS}>
      {({ Tab, TabSelector }) => (
        <Box width="100%">
          <TabSelector />
          <Box mt="lg">
            <Tab tabId="errors">
              <Card direction="row">
                <Flex align="center" gap="md">
                  <Icon color="red-500" icon="tabler:alert-circle" size="2em" />
                  <Flex direction="column" gap="xs">
                    <Text weight="semibold">3 errors found</Text>
                    <Text color="muted" size="sm">
                      Failed builds, missing env vars, connection refused
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Tab>
            <Tab tabId="warnings">
              <Card direction="row">
                <Flex align="center" gap="md">
                  <Icon
                    color="yellow-500"
                    icon="tabler:alert-triangle"
                    size="2em"
                  />
                  <Flex direction="column" gap="xs">
                    <Text weight="semibold">7 warnings</Text>
                    <Text color="muted" size="sm">
                      Deprecated APIs, unused variables, slow queries
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Tab>
            <Tab tabId="success">
              <Card direction="row">
                <Flex align="center" gap="md">
                  <Icon
                    color="green-500"
                    icon="tabler:circle-check"
                    size="2em"
                  />
                  <Flex direction="column" gap="xs">
                    <Text weight="semibold">42 passed</Text>
                    <Text color="muted" size="sm">
                      All checks passed, ready to deploy
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            </Tab>
          </Box>
        </Box>
      )}
    </WithTab>
  )
}
