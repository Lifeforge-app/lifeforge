import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Text } from '@components/primitives'

import { ScrollableStory } from '@/storybook/ScrollableStory'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    hasDuration: false,
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <ScrollableStory>
        <Text as="div" mb="md">
          Current RRule: {value}
        </Text>
        <Index {...args} hasDuration value={value} onChange={onChange} />
      </ScrollableStory>
    )
  }
}
