import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'

import { Card } from '@components/layout'

import VirtualGrid from './VirtualGrid'

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
  color: string
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
    short: 5 + Math.floor(Math.random() * 5), // 5-9 words
    medium: 15 + Math.floor(Math.random() * 10), // 15-24 words
    long: 40 + Math.floor(Math.random() * 20) // 40-59 words
  }

  const count = wordCounts[length]

  const result: string[] = []

  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)])
  }

  // Capitalize first word and add period at the end
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1)

  return result.join(' ') + '.'
}

const generateSampleItems = (count: number): SampleItem[] => {
  const colors = [
    'bg-red-500 text-red-700',
    'bg-blue-500 text-blue-700',
    'bg-green-500 text-green-700',
    'bg-yellow-500 text-yellow-700',
    'bg-purple-500 text-purple-700',
    'bg-pink-500 text-pink-700',
    'bg-indigo-500 text-indigo-700',
    'bg-orange-500 text-orange-700'
  ]

  const lengths: Array<'short' | 'medium' | 'long'> = [
    'short',
    'medium',
    'long'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Item ${i + 1}`,
    description: generateLoremIpsum(
      lengths[Math.floor(Math.random() * lengths.length)]
    ),
    color: colors[i % colors.length]
  }))
}

function CardItem({ item }: { item: SampleItem }) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <Card ref={cardRef} className="h-full">
      <div
        className={`flex-center aspect-video w-full rounded-lg ${item.color} text-2xl font-semibold`}
      >
        {cardRef.current?.offsetHeight ? (
          `${cardRef.current?.offsetHeight}px`
        ) : (
          <Icon className="size-6" icon="svg-spinners:ring-resize" />
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
      <p className="text-bg-500 text-sm">{item.description}</p>
    </Card>
  )
}

/**
 * Basic usage of VirtualGrid with a moderate number of items.
 * Each item has varying description lengths to demonstrate dynamic row heights.
 */
export const Default: Story = {
  args: {
    items: generateSampleItems(50),
    // @ts-expect-error - The type cannot be inferred here
    renderItem: (item: SampleItem) => <CardItem item={item} />,
    // @ts-expect-error - The type cannot be inferred here
    getItemKey: (item: SampleItem) => item.id,
    itemMinWidth: 240,
    gap: 12
  },
  render: args => (
    <div className="h-screen w-full p-6">
      <VirtualGrid {...args} />
    </div>
  )
}

/**
 * VirtualGrid with a large dataset (1000+ items) to demonstrate
 * performance benefits of virtualization.
 */
export const LargeDataset: Story = {
  args: {
    items: generateSampleItems(1000),
    // @ts-expect-error - The type cannot be inferred here
    renderItem: (item: SampleItem) => <CardItem item={item} />,
    // @ts-expect-error - The type cannot be inferred here
    getItemKey: (item: SampleItem) => item.id,
    itemMinWidth: 240
  },
  render: args => (
    <div className="h-screen w-full p-6">
      <VirtualGrid {...args} />
    </div>
  )
}

/**
 * VirtualGrid with wider items showing fewer items per row.
 */
export const WiderItems: Story = {
  args: {
    items: generateSampleItems(50),
    // @ts-expect-error - The type cannot be inferred here
    renderItem: (item: SampleItem) => (
      <Card className="h-full">
        <div className={`aspect-video w-full rounded-lg ${item.color}`} />
        <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
        <p className="text-bg-500">{item.description}</p>
      </Card>
    ),
    // @ts-expect-error - The type cannot be inferred here
    getItemKey: (item: SampleItem) => item.id,
    itemMinWidth: 400,
    gap: 16
  },
  render: args => (
    <div className="h-screen w-full p-6">
      <VirtualGrid {...args} />
    </div>
  )
}

/**
 * VirtualGrid with compact items showing more items per row.
 */
export const CompactItems: Story = {
  args: {
    items: generateSampleItems(200),
    // @ts-expect-error - The type cannot be inferred here
    renderItem: (item: SampleItem) => (
      <Card className="h-full">
        <div className={`aspect-square w-full rounded-lg ${item.color}`}>
          {}
        </div>
        <h3 className="mt-4 text-sm font-semibold">{item.title}</h3>
      </Card>
    ),
    // @ts-expect-error - The type cannot be inferred here
    getItemKey: (item: SampleItem) => item.id,
    itemMinWidth: 150,
    gap: 8
  },
  render: args => (
    <div className="h-screen w-full p-6">
      <VirtualGrid {...args} />
    </div>
  )
}
