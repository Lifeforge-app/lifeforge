import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'

import { Card } from '@/components/layout'
import { Box, Flex, Icon, Text } from '@/components/primitives'

import { TAILWIND_PALETTE } from '@/system'

import { VirtualGrid } from './index'

const meta = {
  component: VirtualGrid,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof VirtualGrid>

export default meta

type Story = StoryObj<typeof meta>

interface SampleItem {
  id: number
  title: string
  description: string
}

const generateLoremIpsum = (length: 'short' | 'medium' | 'long'): string => {
  const words = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
    'exercitation',
    'ullamco',
    'laboris',
    'nisi',
    'aliquip',
    'ex',
    'ea',
    'commodo',
    'consequat'
  ]

  const wordCounts = {
    long: 40 + Math.floor(Math.random() * 20),
    medium: 15 + Math.floor(Math.random() * 10),
    short: 5 + Math.floor(Math.random() * 5)
  }

  const count = wordCounts[length]

  const result: string[] = []

  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)])
  }

  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1)

  return result.join(' ') + '.'
}

const generateSampleItems = (count: number): SampleItem[] => {
  const lengths: Array<'short' | 'medium' | 'long'> = [
    'short',
    'medium',
    'long'
  ]

  return Array.from({ length: count }, (_, i) => ({
    description: generateLoremIpsum(
      lengths[Math.floor(Math.random() * lengths.length)]
    ),
    id: i,
    title: `Item ${i + 1}`
  }))
}

const COLORS = [
  TAILWIND_PALETTE.red[500],
  TAILWIND_PALETTE.blue[500],
  TAILWIND_PALETTE.green[500],
  TAILWIND_PALETTE.yellow[500],
  TAILWIND_PALETTE.purple[500],
  TAILWIND_PALETTE.pink[500],
  TAILWIND_PALETTE.indigo[500],
  TAILWIND_PALETTE.orange[500]
]

function CardItem({ item }: { item: SampleItem }) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <Card ref={cardRef} height="100%">
      <Flex
        align="center"
        justify="center"
        rounded="lg"
        style={{
          aspectRatio: '16 / 9',
          backgroundColor: COLORS[item.id % COLORS.length]
        }}
        width="100%"
      >
        {cardRef.current?.offsetHeight ? (
          <Text size="2xl" style={{ color: '#fff' }} weight="semibold">
            {cardRef.current?.offsetHeight}px
          </Text>
        ) : (
          <Icon color="primary" icon="svg-spinners:ring-resize" size="1.5rem" />
        )}
      </Flex>
      <Text mt="md" size="lg" weight="semibold">
        {item.title}
      </Text>
      <Text color="muted" size="sm">
        {item.description}
      </Text>
    </Card>
  )
}

export const Default: Story = {
  args: {
    getItemKey: () => '',
    itemMinWidth: 240,
    items: [],
    renderItem: () => <></>
  },
  render: () => (
    <Box height="100vh" py="2xl" width="100%">
      <VirtualGrid
        getItemKey={(item: SampleItem) => item.id}
        itemMinWidth={240}
        items={generateSampleItems(50)}
        renderItem={(item: SampleItem) => <CardItem item={item} />}
      />
    </Box>
  )
}

export const LargeDataset: Story = {
  args: {
    getItemKey: () => '',
    itemMinWidth: 240,
    items: [],
    renderItem: () => <></>
  },
  render: props => (
    <Box height="100vh" py="2xl" width="100%">
      <VirtualGrid
        {...props}
        getItemKey={(item: SampleItem) => item.id}
        itemMinWidth={240}
        items={generateSampleItems(1000)}
        renderItem={(item: SampleItem) => <CardItem item={item} />}
      />
    </Box>
  )
}

export const WiderItems: Story = {
  args: {
    getItemKey: () => '',
    itemMinWidth: 400,
    items: [],
    renderItem: () => <></>
  },
  render: props => (
    <Box
      height="100vh"
      minHeight="30rem"
      p="3xl"
      position="fixed"
      width="100vw"
    >
      <VirtualGrid
        {...props}
        getItemKey={(item: SampleItem) => item.id}
        items={generateSampleItems(50)}
        renderItem={(item: SampleItem) => <CardItem item={item} />}
      />
    </Box>
  )
}

export const CompactItems: Story = {
  args: {
    getItemKey: () => '',
    itemMinWidth: 150,
    items: [],
    renderItem: () => <></>
  },
  render: props => (
    <Box height="100vh" p="lg" width="100%">
      <VirtualGrid
        {...props}
        getItemKey={(item: SampleItem) => item.id}
        itemMinWidth={150}
        items={generateSampleItems(200)}
        renderItem={(item: SampleItem) => (
          <Card height="100%">
            <Flex
              rounded="lg"
              style={{
                aspectRatio: '1 / 1',
                backgroundColor: COLORS[item.id % COLORS.length]
              }}
              width="100%"
            />
            <Text mt="md" size="sm" weight="semibold">
              {item.title}
            </Text>
          </Card>
        )}
      />
    </Box>
  )
}
