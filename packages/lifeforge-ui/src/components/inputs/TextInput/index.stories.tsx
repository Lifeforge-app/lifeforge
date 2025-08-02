import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import TextInput from '.'

const meta = {
  component: TextInput
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    placeholder: 'John Doe',
    setValue: () => {},
    namespace: false,
    value: ''
  },
  render: args => {
    const [value, setValue] = useState('')

    return <TextInput {...args} setValue={setValue} value={value} />
  }
}

export const PasswordInput: Story = {
  args: {
    icon: 'tabler:key',
    label: 'Password',
    placeholder: 'Type your password here',
    namespace: false,
    value: '',
    isPassword: true,
    setValue: () => {}
  },

  render: args => {
    const [value, setValue] = useState('')

    return <TextInput {...args} setValue={setValue} value={value} />
  }
}

export const WithActionButton: Story = {
  args: {
    icon: 'tabler:barcode',
    label: 'Barcode',
    placeholder: '0123456789',
    namespace: false,
    value: '',
    actionButtonProps: {
      icon: 'tabler:scan',
      onClick: () => {}
    },
    setValue: () => {}
  },

  render: args => {
    const [value, setValue] = useState('')

    return <TextInput {...args} setValue={setValue} value={value} />
  }
}
