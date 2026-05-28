import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Switch } from './index'

const meta = {
  component: Switch
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onChange: () => {},
    value: true
  },
  render: props => {
    const [checked, setChecked] = useState(props.value)

    return (
      <Switch
        {...props}
        value={checked}
        onChange={value => {
          setChecked(value)
          props.onChange(value)
        }}
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    onChange: () => {},
    value: false
  }
}

export const Unchecked: Story = {
  args: {
    onChange: () => {},
    value: false
  }
}
