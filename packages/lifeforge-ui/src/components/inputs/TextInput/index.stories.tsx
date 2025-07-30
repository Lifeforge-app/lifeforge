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
    name: 'Username',
    placeholder: 'John Doe',
    setValue: () => {},
    darker: true,
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
    name: 'Password',
    placeholder: 'Type your password here',
    darker: true,
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
    name: 'Barcode',
    placeholder: '0123456789',
    darker: true,
    namespace: false,
    value: '',
    actionButtonIcon: 'tabler:scan',
    setValue: () => {}
  },

  render: args => {
    const [value, setValue] = useState('')

    return <TextInput {...args} setValue={setValue} value={value} />
  }
}
