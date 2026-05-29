import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Bordered,
  Flex,
  Grid,
  Stack,
  Text,
  Transition
} from '@/components/primitives'

import { Ring } from './index'

const meta = {
  argTypes: {
    bg: { control: false },
    children: { control: false },
    ringColor: { control: false },
    ringOffsetColor: { control: false },
    rounded: {
      control: { type: 'select' },
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']
    }
  },
  component: Ring
} satisfies Meta<typeof Ring>

export default meta

type Story = StoryObj<typeof meta>

function DemoBox({ label }: { label: string }) {
  return (
    <Flex align="center" justify="center" p="md">
      <Text color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
        {label}
      </Text>
    </Flex>
  )
}

export const Default: Story = {
  args: {
    ringColor: 'custom-500',
    ringWidth: '3px'
  },
  render: args => (
    <Flex align="center" height="100%" justify="center" p="3xl">
      <Ring {...args} p="lg" r="lg" width="20rem">
        <Text as="p" color={{ base: 'bg-600', dark: 'bg-400' }}>
          A simple container with a 3px custom-500 ring. Very clean and
          beautiful.
        </Text>
      </Ring>
    </Flex>
  )
}

export const RingColor: Story = {
  args: {},
  render: () => (
    <Grid gap="lg" p="3xl" templateCols={3}>
      <Ring p="md" r="lg" ringColor="custom-500">
        <DemoBox label="custom-500 (flat)" />
      </Ring>
      <Ring
        p="md"
        r="lg"
        ringColor={{ base: 'custom-300', dark: 'custom-600' }}
      >
        <DemoBox label="custom-300 / custom-600 (adaptive)" />
      </Ring>
      <Ring
        p="md"
        r="lg"
        ringColor={{
          base: 'bg-400',
          dark: 'bg-600',
          darkHover: 'custom-400',
          hover: 'custom-500'
        }}
      >
        <DemoBox label="hover + dark + darkHover conditions" />
      </Ring>
    </Grid>
  )
}

export const RingWidth: Story = {
  args: {},
  render: () => (
    <Stack gap="xl" px="md">
      {(['1px', '2px', '4px', '8px'] as const).map(w => (
        <Ring key={w} p="md" r="lg" ringWidth={w}>
          <DemoBox label={`ringWidth="${w}"`} />
        </Ring>
      ))}
    </Stack>
  )
}

export const RingOffset: Story = {
  args: {},
  render: () => (
    <Stack>
      <Ring
        p="md"
        r="lg"
        ringColor="custom-500"
        ringOffsetColor="dangerous"
        ringOffsetWidth="6px"
        ringWidth="4px"
      >
        <DemoBox label="6px away from container" />
      </Ring>
    </Stack>
  )
}

export const InsetRing: Story = {
  args: {},
  render: () => (
    <Flex align="center" height="100%" justify="center" p="3xl">
      <Ring
        ringInset
        p="lg"
        r="lg"
        ringColor="custom-500"
        ringWidth="4px"
        width="20rem"
      >
        <Text as="p" color={{ base: 'bg-600', dark: 'bg-400' }}>
          An inset ring drawn on the inside of the container edge.
        </Text>
      </Ring>
    </Flex>
  )
}

export const AsChild: Story = {
  args: {},
  render: () => (
    <Flex direction="column" gap="md" p="3xl">
      <Transition duration="0.1s">
        <Ring
          asChild
          r="md"
          ringColor={{
            base: 'transparent',
            darkHover: 'custom-400',
            hover: 'custom-500'
          }}
          ringOffsetColor={{ base: 'bg-50', dark: 'bg-900' }}
          ringOffsetWidth="2px"
          ringWidth="3px"
        >
          <button
            style={{
              backgroundColor: 'var(--color-custom-600)',
              border: 'none',
              borderRadius: '0.375rem',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              padding: '1rem 2rem'
            }}
          >
            Hover to see Ring
          </button>
        </Ring>
      </Transition>
    </Flex>
  )
}

export const WithBordered: Story = {
  args: {},
  render: () => (
    <Flex direction="column" gap="md" p="3xl">
      <Ring
        asChild
        r="lg"
        ringColor={{ base: 'bg-300', dark: 'bg-700' }}
        ringOffsetColor={{ base: 'bg-50', dark: 'bg-900' }}
        ringOffsetWidth="3px"
        ringWidth="2px"
      >
        <Bordered
          bg={{ base: 'bg-50', dark: 'bg-900' }}
          borderColor={{ base: 'bg-300', dark: 'bg-700' }}
          borderWidth="2px"
          p="lg"
          r="lg"
          style={{ cursor: 'pointer', transition: 'all 0.2s' }}
        >
          <Text weight="semibold">Card with Ring + Border</Text>
          <Text as="p" color={{ base: 'bg-500', dark: 'bg-400' }} mt="xs">
            A composition showing a 2px ring and a 2px bordered container. The
            ring expands outward from the container with a 3px offset, creating
            a doubled border effect.
          </Text>
        </Bordered>
      </Ring>
    </Flex>
  )
}
