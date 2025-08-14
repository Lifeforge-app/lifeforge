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
    setValue: () => {},
    hasDuration: false
  },
  render: args => {
    const [value, setValue] = useState('')

    return (
      <div>
        Current RRule: {value}
        <Index {...args} hasDuration setValue={setValue} value={value} />
      </div>
    )
  }
}
