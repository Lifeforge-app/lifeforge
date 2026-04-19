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
    value: '',
    onChange: () => {},
    hasDuration: false
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <div className="px-32">
        Current RRule: {value}
        <Index {...args} hasDuration onChange={onChange} value={value} />
      </div>
    )
  }
}
