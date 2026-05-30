import type { Meta, StoryObj } from '@storybook/react-vite'

import { Alert } from '@/components/feedback'
import { Flex, Grid, Text, Transition } from '@/components/primitives'

import { Icon } from './index'

const meta = {
  argTypes: {
    color: { control: false },
    icon: {
      control: { type: 'text' }
    },
    size: { control: { type: 'text' } }
  },
  component: Icon
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:home'
  }
}

export const IconSet: Story = {
  args: {
    icon: 'tabler:star'
  },
  render: () => (
    <Grid gap="lg" templateCols={{ base: 3, md: 5, sm: 4 }}>
      {[
        { icon: 'tabler:home', label: 'home' },
        { icon: 'tabler:user', label: 'user' },
        { icon: 'tabler:settings', label: 'settings' },
        { icon: 'tabler:bell', label: 'bell' },
        { icon: 'tabler:mail', label: 'mail' },
        { icon: 'tabler:calendar', label: 'calendar' },
        { icon: 'tabler:search', label: 'search' },
        { icon: 'tabler:heart', label: 'heart' },
        { icon: 'tabler:star', label: 'star' },
        { icon: 'tabler:plus', label: 'plus' },
        { icon: 'tabler:x', label: 'close' },
        { icon: 'tabler:chevron-down', label: 'chevron' },
        { icon: 'tabler:trash', label: 'delete' },
        { icon: 'tabler:pencil', label: 'edit' },
        { icon: 'tabler:download', label: 'download' }
      ].map(({ icon, label }) => (
        <Flex
          key={icon}
          align="center"
          direction="column"
          gap="sm"
          p="md"
          style={{ borderRadius: '0.5rem' }}
        >
          <Icon icon={icon} size="2rem" />
          <Text color="muted" size="sm">
            {label}
          </Text>
        </Flex>
      ))}
    </Grid>
  )
}

export const Size: Story = {
  args: {
    icon: 'tabler:star',
    size: '1.25em'
  },
  render: () => (
    <Flex align="center" gap="lg">
      {(['1em', '1.25em', '1.5em', '2em', '3em', '4em', '6em'] as const).map(
        size => (
          <Flex key={size} align="center" direction="column" gap="sm">
            <Icon icon="tabler:star" size={size} />
            <Text color="muted" size="sm">
              {size}
            </Text>
          </Flex>
        )
      )}
    </Flex>
  )
}

export const Color: Story = {
  args: {
    color: 'custom-500',
    icon: 'tabler:heart',
    size: '2rem'
  },
  render: () => (
    <Flex align="center" gap="lg">
      {(
        [
          { color: 'custom-500', label: 'custom-500' },
          {
            color: 'muted',
            label: 'muted'
          },
          {
            color: { base: 'bg-800', dark: 'bg-100' },
            label: 'adaptive'
          }
        ] as const
      ).map(({ color, label }) => (
        <Flex key={label} align="center" direction="column" gap="sm">
          <Icon color={color} icon="tabler:heart" size="2rem" />
          <Text color="muted" size="sm">
            {label}
          </Text>
        </Flex>
      ))}
    </Flex>
  )
}

export const WithText: Story = {
  args: {
    icon: 'tabler:mail'
  },
  render: () => (
    <Flex align="center" direction="column" gap="md">
      <Flex align="center" gap="sm">
        <Icon icon="tabler:mail" />
        <Text>hello@example.com</Text>
      </Flex>
      <Flex align="center" gap="sm">
        <Icon color="custom-500" icon="tabler:bell" size="1.5em" />
        <Text color="primary" weight="semibold">
          Notifications
        </Text>
      </Flex>
      <Flex align="center" gap="sm">
        <Icon color="bg-400" icon="tabler:clock" size="1.25em" />
        <Text color="muted">Last updated 2 hours ago</Text>
      </Flex>
    </Flex>
  )
}

export const Interactive: Story = {
  args: {
    icon: 'tabler:thumb-up',
    size: '1.75rem'
  },
  render: () => (
    <Flex align="center" direction="column" gap="md">
      <Alert type="note">
        Hover over the icons below to see the color change.
      </Alert>
      <Flex align="center" gap="2xl">
        {(
          [
            { icon: 'tabler:thumb-up', label: 'Like' },
            { icon: 'tabler:bookmark', label: 'Save' },
            { icon: 'tabler:share', label: 'Share' },
            { icon: 'tabler:flag', label: 'Report' }
          ] as const
        ).map(({ icon, label }) => (
          <Flex
            key={icon}
            align="center"
            direction="column"
            gap="xs"
            style={{ cursor: 'pointer' }}
          >
            <Transition>
              <Icon
                color={{
                  base: 'bg-500',
                  dark: 'bg-400',
                  darkHover: 'custom-400',
                  hover: 'custom-500'
                }}
                icon={icon}
                size="1.75rem"
              />
            </Transition>
            <Text color="muted" size="sm">
              {label}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}
