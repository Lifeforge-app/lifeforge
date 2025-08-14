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
    value: 'tabler:cube',
    setValue: () => {},
    namespace: 'namespace'
  },
  render: args => {
    const [icon, setIcon] = useState(args.value)

    return <Index {...args} disabled={false} value={icon} setValue={setIcon} />
  }
}
