import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card } from '@components/layout'
import { Box, Flex } from '@components/primitives'

import { Scrollbar } from './index'

const meta = {
  argTypes: {
    children: {
      control: false
    }
  },
  component: Scrollbar
} satisfies Meta<typeof Scrollbar>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A scrollbar with large content that requires scrolling.
 */
export const Default: Story = {
  args: {
    children: <></>
  },
  render: args => (
    <Box height="100%" my="3xl" width="100%">
      <Scrollbar {...args}>
        <Flex direction="column" gap="md">
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </Flex>
      </Scrollbar>
    </Box>
  )
}

/**
 * A scrollbar with minimal content (no scroll needed).
 */
export const MinimalContent: Story = {
  args: {
    children: <></>
  },
  render: args => (
    <Box height="100%" my="3xl" width="100%">
      <Scrollbar {...args}>
        <Flex direction="column" gap="md">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </Flex>
      </Scrollbar>
    </Box>
  )
}

export const WithoutAutoHide: Story = {
  args: {
    autoHide: false,
    children: <></>
  },
  render: args => (
    <Box height="100%" my="3xl" width="100%">
      <Scrollbar {...args}>
        <Flex direction="column" gap="md">
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>Item {i + 1}</Card>
          ))}
        </Flex>
      </Scrollbar>
    </Box>
  )
}
