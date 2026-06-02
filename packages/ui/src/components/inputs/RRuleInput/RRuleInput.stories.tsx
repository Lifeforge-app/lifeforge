import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Text } from '@/components/primitives'
import { ScrollableStory } from '@/storybook/ScrollableStory'

import { RRuleInput } from './index'

const meta = {
  component: RRuleInput,
  title: 'Inputs/RRuleInput'
} satisfies Meta<typeof RRuleInput>

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
        <RRuleInput {...args} hasDuration value={value} onChange={onChange} />
      </ScrollableStory>
    )
  }
}
