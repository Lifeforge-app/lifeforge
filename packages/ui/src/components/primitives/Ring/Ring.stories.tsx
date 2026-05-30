import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CSSProperties } from 'react'

import { Button } from '@/components/inputs'
import { Card } from '@/components/layout'
import {
  Bordered,
  Flex,
  Stack,
  Text,
  Transition
} from '@/components/primitives'
import { TAILWIND_PALETTE, type TokenizedColor } from '@/system'

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

function DemoBox({
  className,
  label,
  style
}: {
  label: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <Card centered className={className} p="md" style={style}>
      <Text color={{ base: 'bg-500', dark: 'bg-400' }}>{label}</Text>
    </Card>
  )
}

export const Default: Story = {
  args: {
    ringColor: 'custom-500',
    ringWidth: '3px'
  },
  render: args => (
    <Ring asChild {...args} p="lg" r="lg">
      <DemoBox label="The quick brown fox jump over the lazy dog" />
    </Ring>
  )
}

export const RingColor: Story = {
  args: {},
  render: () => (
    <Stack gap="xl">
      <Ring asChild p="md" r="lg" ringColor="custom-500">
        <DemoBox label="custom-500 (flat)" />
      </Ring>
      <Ring
        asChild
        p="md"
        r="lg"
        ringColor={{ base: 'custom-300', dark: 'custom-600' }}
      >
        <DemoBox label="custom-300 / custom-600 (adaptive)" />
      </Ring>
      <Transition>
        <Ring
          asChild
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
      </Transition>
    </Stack>
  )
}

export const RingWidth: Story = {
  args: {},
  render: () => (
    <Stack gap="xl" px="md">
      {(['1px', '2px', '4px', '8px'] as const).map(w => (
        <Ring key={w} asChild p="md" r="lg" ringWidth={w}>
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
        asChild
        r="lg"
        ringColor="custom-500"
        ringOffsetWidth="10px"
        ringWidth="4px"
      >
        <DemoBox label="10px away from container" />
      </Ring>
    </Stack>
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
          ringOffsetWidth="2px"
          ringWidth="3px"
        >
          <Button>Hover to see Ring</Button>
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

function RainbowRings({
  colors,
  index = 0
}: {
  colors: string[]
  index?: number
}) {
  if (index >= colors.length) {
    return <DemoBox label="It feels good to look at some colorful stuff" />
  }

  return (
    <Ring
      ringColor={`${colors[index]}-500` as TokenizedColor}
      ringOffsetWidth={`${index * 10}px`}
      ringWidth="5px"
    >
      <RainbowRings colors={colors} index={index + 1} />
    </Ring>
  )
}

export const Rainbow: Story = {
  args: {},
  render: () => (
    <Flex align="center" justify="center" p="3xl" width="100%">
      <RainbowRings colors={Object.keys(TAILWIND_PALETTE)} />
    </Flex>
  )
}
