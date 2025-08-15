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
    label: 'Icon of Something',
    value: 'tabler:cube',
    setValue: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [icon, setIcon] = useState(args.value)

    return <Index {...args} disabled={false} setValue={setIcon} value={icon} />
  }
}

export const Required: Story = {
  args: {
    label: 'Icon of Something',
    value: 'tabler:cube',
    setValue: () => {},
    namespace: 'namespace',
    required: true
  },

  render: args => {
    const [icon, setIcon] = useState(args.value)

    return <Index {...args} disabled={false} setValue={setIcon} value={icon} />
  }
}
