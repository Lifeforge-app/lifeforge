import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Box } from '@components/primitives'

import SliderInput from './SliderInput'

const meta = {
  component: SliderInput
} satisfies Meta<typeof SliderInput>

export default meta

type Story = StoryObj<typeof meta>

function SliderStory(args: React.ComponentProps<typeof SliderInput>) {
  const [value, onChange] = useState(args.value)

  return (
    <Box width={{ base: '12rem', sm: '24rem' }}>
      <SliderInput {...args} value={value} onChange={onChange} />
    </Box>
  )
}

export const Default: Story = {
  args: {
    icon: 'tabler:rotate',
    label: 'Rotation',
    value: 45,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}

export const WithoutLabel: Story = {
  args: {
    value: 50,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}

export const Required: Story = {
  args: {
    icon: 'tabler:star',
    label: 'Rating',
    value: 0,
    required: true,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:volume',
    label: 'Volume',
    value: 30,
    disabled: true,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}

export const CustomRange: Story = {
  args: {
    icon: 'tabler:temperature',
    label: 'Temperature',
    value: 20,
    min: -20,
    max: 50,
    step: 0.5,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}

export const Percentage: Story = {
  args: {
    icon: 'tabler:percent',
    label: 'Opacity',
    value: 80,
    min: 0,
    max: 100,
    step: 5,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}

export const StepLarge: Story = {
  args: {
    icon: 'tabler:clock',
    label: 'Duration (minutes)',
    value: 30,
    min: 0,
    max: 120,
    step: 15,
    onChange: () => {}
  },
  render: args => <SliderStory {...args} />
}
