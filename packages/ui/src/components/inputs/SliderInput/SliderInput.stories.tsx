import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { SliderInput } from './index'

const meta = {
  component: SliderInput
} satisfies Meta<typeof SliderInput>

export default meta

type Story = StoryObj<typeof meta>

function SliderStory(args: React.ComponentProps<typeof SliderInput>) {
  const [value, onChange] = useState(args.value)

  return <SliderInput {...args} value={value} onChange={onChange} />
}

export const Default: Story = {
  args: {
    icon: 'tabler:rotate',
    label: 'Rotation',
    onChange: () => {},
    value: 45
  },
  render: args => <SliderStory {...args} />
}

export const WithoutLabel: Story = {
  args: {
    onChange: () => {},
    value: 50
  },
  render: args => <SliderStory {...args} />
}

export const Required: Story = {
  args: {
    icon: 'tabler:star',
    label: 'Rating',
    onChange: () => {},
    required: true,
    value: 0
  },
  render: args => <SliderStory {...args} />
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: 'tabler:volume',
    label: 'Volume',
    onChange: () => {},
    value: 30
  },
  render: args => <SliderStory {...args} />
}

export const CustomRange: Story = {
  args: {
    icon: 'tabler:temperature',
    label: 'Temperature',
    max: 50,
    min: -20,
    onChange: () => {},
    step: 0.5,
    value: 20
  },
  render: args => <SliderStory {...args} />
}

export const Percentage: Story = {
  args: {
    icon: 'tabler:percent',
    label: 'Opacity',
    max: 100,
    min: 0,
    onChange: () => {},
    step: 5,
    value: 80
  },
  render: args => <SliderStory {...args} />
}

export const StepLarge: Story = {
  args: {
    icon: 'tabler:clock',
    label: 'Duration (minutes)',
    max: 120,
    min: 0,
    onChange: () => {},
    step: 15,
    value: 30
  },
  render: args => <SliderStory {...args} />
}
