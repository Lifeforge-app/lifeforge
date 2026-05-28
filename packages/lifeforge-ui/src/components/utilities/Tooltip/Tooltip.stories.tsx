import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Flex, Text } from '@components/primitives'

import { Tooltip } from './index'

const meta = {
  argTypes: {
    children: {
      control: false
    }
  },
  component: Tooltip
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A simple tooltip with informational content.
 */
export const Default: Story = {
  args: {
    children: 'This is helpful information for the user.',
    icon: 'tabler:info-circle',
    id: 'info-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Flex align="center" gap="sm">
        <Text>Hover over the icon</Text>
        <Tooltip {...args} />
      </Flex>
    </Flex>
  )
}

/**
 * A tooltip with clickable content.
 */
export const ClickableTooltip: Story = {
  args: {
    children: (
      <>
        Visit{' '}
        <Text
          as="a"
          color="custom-500"
          decoration="underline"
          href="https://docs.lifeforge.dev"
          rel="noreferrer"
          target="_blank"
        >
          LifeForge Docs
        </Text>{' '}
        to learn more about this project.
      </>
    ),
    clickable: true,
    icon: 'tabler:question-circle',
    id: 'help-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Flex align="center" gap="sm">
        <Text>Need help?</Text>
        <Tooltip {...args} />
      </Flex>
    </Flex>
  )
}

/**
 * A detailed tooltip with multiple lines of information.
 */
export const DetailedTooltip: Story = {
  args: {
    children: (
      <Box maxWidth="20rem">
        <Text
          asChild
          color={{ base: 'bg-800', dark: 'bg-100' }}
          size="lg"
          weight="semibold"
        >
          <Flex align="center" gap="sm" mb="sm">
            <Icon icon="tabler:info-circle" />
            Detailed Information
          </Flex>
        </Text>
        <Text>
          This is a detailed tooltip with multiple lines of information.
        </Text>
        <Text mt="sm">It can contain longer explanations and guides.</Text>
      </Box>
    ),
    icon: 'tabler:info-circle',
    id: 'detailed-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Flex align="center" gap="sm">
        <Text>Hover for details</Text>
        <Tooltip {...args} />
      </Flex>
    </Flex>
  )
}

export const OpenOnClick: Story = {
  args: {
    children: 'This tooltip opens on click instead of hover.',
    icon: 'tabler:info-circle',
    id: 'click-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Flex align="center" gap="sm">
        <Text>Click the icon</Text>
        <Tooltip {...args} openOnClick />
      </Flex>
    </Flex>
  )
}

export const ErrorTooltip: Story = {
  args: {
    children: (
      <>
        <Flex align="center" gap="sm" mb="sm">
          <Text color="dangerous" size="lg" weight="semibold">
            Error Details
          </Text>
        </Flex>
        <Text>
          An unexpected error has occurred while processing your request.
        </Text>
        <Text mt="sm">
          Please try again later or contact support if the issue persists.
        </Text>
      </>
    ),
    icon: 'tabler:alert-circle',
    iconClassName: 'text-red-500',
    id: 'error-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Flex align="center" gap="sm">
        <Text>Error info</Text>
        <Tooltip {...args} />
      </Flex>
    </Flex>
  )
}
