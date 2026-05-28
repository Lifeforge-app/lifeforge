import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Checkbox } from './index'

const meta = {
  component: Checkbox
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    checked: true,
    disabled: false,
    label: '',
    onCheckedChange: () => {}
  },
  render: props => {
    const [checked, setChecked] = useState(props.checked)

    return (
      <Checkbox {...props} checked={checked} onCheckedChange={setChecked} />
    )
  }
}

export const WithLabel: Story = {
  args: {
    checked: true,
    disabled: false,
    label: 'Accept terms and conditions'
  }
}

export const Unchecked: Story = {
  args: {
    checked: false,
    disabled: false,
    label: 'Accept terms and conditions'
  }
}

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    label: ''
  }
}
