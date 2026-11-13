import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'

import { Tooltip } from './index'

const meta = {
  argTypes: {
    children: {
      control: false
    }
  },
  component: Tooltip,
  title: 'Utilities/Tooltip'
} satisfies Meta<typeof Tooltip>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A simple tooltip attached to a trigger through `data-tooltip-id`.
 */
export const Default: Story = {
  args: {
    children: 'This is helpful information for the user.',
    id: 'info-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Box>
        <Button data-tooltip-id="info-tooltip">Hover over me</Button>
        <Tooltip {...args} />
      </Box>
    </Flex>
  )
}

/**
 * A tooltip with clickable content that stays open on click.
 */
export const ClickableTooltip: Story = {
  args: {
    children: (
      <>
        Visit{' '}
        <Text
          as="a"
          color="primary"
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
    id: 'help-tooltip',
    openOnClick: true
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Box>
        <Button data-tooltip-id="help-tooltip" icon="tabler:help">
          Click me
        </Button>
        <Tooltip {...args} />
      </Box>
    </Flex>
  )
}

/**
 * A detailed tooltip with multiple lines of information.
 */
export const DetailedTooltip: Story = {
  args: {
    children: (
      <>
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
      </>
    ),
    id: 'detailed-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Box>
        <Button data-tooltip-id="detailed-tooltip">Hover for details</Button>
        <Tooltip {...args} />
      </Box>
    </Flex>
  )
}

/**
 * A tooltip with custom content styling.
 */
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
    id: 'error-tooltip'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" width="100%">
      <Box>
        <Button dangerous data-tooltip-id="error-tooltip">
          Error info
        </Button>
        <Tooltip {...args} />
      </Box>
    </Flex>
  )
}
