import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Cube Color',
    value: '',
    onChange: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [color, setColor] = useState<string>('')

    return <Index {...args} value={color} onChange={setColor} />
  }
}

export const PlainVariant: Story = {
  args: {
    label: 'Cube Color',
    value: '',
    namespace: 'namespace',
    variant: 'plain'
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <Index {...args} value={color} onChange={setColor} />
  }
}
