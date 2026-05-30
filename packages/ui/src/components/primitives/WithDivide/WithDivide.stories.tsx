import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from '@/components/layout'
import { Box, Flex, Text } from '@/components/primitives'

import { WithDivide } from './index'

const meta = {
  argTypes: {
    axis: {
      control: { type: 'select' },
      options: ['x', 'y']
    },
    children: { control: false },
    color: { control: 'color' }
  },
  component: WithDivide
} satisfies Meta<typeof WithDivide>

export default meta

type Story = StoryObj<typeof meta>

const items = [
  { id: 1, subtitle: 'Last updated 2 days ago', title: 'Project Alpha' },
  { id: 2, subtitle: 'Last updated 5 hours ago', title: 'Project Beta' },
  { id: 3, subtitle: 'Last updated yesterday', title: 'Project Gamma' },
  { id: 4, subtitle: 'Last updated 1 week ago', title: 'Project Delta' },
  { id: 5, subtitle: 'Last updated 3 days ago', title: 'Project Epsilon' }
]

export const Default: Story = {
  args: {
    children: null
  },
  render: () => (
    <Card width="100%">
      {items.map(item => (
        <WithDivide key={item.id}>
          <Flex justify="between" p="md">
            <Text color={{ base: 'bg-800', dark: 'bg-50' }} weight="semibold">
              {item.title}
            </Text>
            <Text color="muted">{item.subtitle}</Text>
          </Flex>
        </WithDivide>
      ))}
    </Card>
  )
}

export const Vertical: Story = {
  args: {
    axis: 'y',
    children: null
  },
  render: () => (
    <Flex>
      {items.slice(0, 3).map(item => (
        <WithDivide key={item.id} axis="y">
          <Box p="md">
            <Text weight="semibold">{item.title}</Text>
          </Box>
        </WithDivide>
      ))}
    </Flex>
  )
}

export const CustomColor: Story = {
  args: {
    children: null,
    color: 'custom-500'
  },
  render: args => (
    <Card width="100%">
      {items.map(item => (
        <WithDivide key={item.id} {...args}>
          <Flex justify="between" p="md">
            <Text color={{ base: 'bg-800', dark: 'bg-50' }} weight="semibold">
              {item.title}
            </Text>
            <Text color="muted">{item.subtitle}</Text>
          </Flex>
        </WithDivide>
      ))}
    </Card>
  )
}

export const Nested: Story = {
  args: {
    children: null
  },
  render: () => (
    <Card width="100%">
      <WithDivide>
        <Box p="md">
          <Text
            color={{ base: 'custom-500' }}
            display="block"
            p="sm"
            transform="uppercase"
            weight="semibold"
          >
            Active
          </Text>
          {[
            { id: 1, label: 'Task A' },
            { id: 2, label: 'Task B' }
          ].map(item => (
            <WithDivide key={item.id}>
              <Box p="sm">
                <Text
                  color={{ base: 'bg-800', dark: 'bg-50' }}
                  weight="semibold"
                >
                  {item.label}
                </Text>
              </Box>
            </WithDivide>
          ))}
        </Box>
      </WithDivide>
      <WithDivide>
        <Box p="md">
          <Text
            color={{ base: 'custom-500' }}
            display="block"
            p="sm"
            transform="uppercase"
            weight="semibold"
          >
            Completed
          </Text>
          {[
            { id: 3, label: 'Task C' },
            { id: 4, label: 'Task D' },
            { id: 5, label: 'Task E' }
          ].map(item => (
            <WithDivide key={item.id}>
              <Box p="sm">
                <Text
                  color={{ base: 'bg-800', dark: 'bg-50' }}
                  weight="semibold"
                >
                  {item.label}
                </Text>
              </Box>
            </WithDivide>
          ))}
        </Box>
      </WithDivide>
    </Card>
  )
}
