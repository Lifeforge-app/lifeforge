import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import Switch from './Switch'

const meta = {
  component: Switch
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: true,
    onChange: () => {}
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
    value: false,
    onChange: () => {},
    disabled: true
  }
}

export const Unchecked: Story = {
  args: {
    value: false,
    onChange: () => {}
  }
}
