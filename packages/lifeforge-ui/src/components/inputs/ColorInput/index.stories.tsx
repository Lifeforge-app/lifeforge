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
    label: 'name',
    value: '',
    setValue: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [color, setColor] = useState<string>('')

    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Index {...args} value={color} setValue={setColor} />
      </div>
    )
  }
}
