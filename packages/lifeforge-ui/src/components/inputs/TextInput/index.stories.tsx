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
