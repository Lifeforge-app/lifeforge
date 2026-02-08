import { Icon } from '@iconify/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Flex, Text } from '@components/primitives'

import TextInput from '.'

const meta = {
  component: TextInput,
  argTypes: {
    actionButtonProps: {
      table: {
        type: {
          summary: 'ButtonProps'
        }
      }
    }
  }
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    placeholder: 'John Doe',
    onChange: () => {},
    value: '',
    namespace: '',
    required: false
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <div>
        <TextInput {...args} value={value} onChange={onChange} />
      </div>
    )
  }
}

export const PasswordInput: Story = {
  args: {
    icon: 'tabler:key',
    label: 'Password',
    placeholder: 'Type your password here',
    value: '',
    isPassword: true,
    onChange: () => {}
  },

  render: args => {
    const [value, onChange] = useState('')

    return (
      <div>
        <TextInput {...args} value={value} onChange={onChange} />
      </div>
    )
  }
}

export const WithActionButton: Story = {
  args: {
    icon: 'tabler:barcode',
    label: 'Barcode',
    placeholder: '0123456789',
    value: '',
    actionButtonProps: {
      icon: 'tabler:scan',
      onClick: () => {}
    },
    onChange: () => {}
  },

  render: args => {
    const [value, onChange] = useState('')

    return (
      <div>
        <TextInput {...args} value={value} onChange={onChange} />
      </div>
    )
  }
}

export const Required: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    placeholder: 'John Doe',
    value: '',
    onChange: () => {},
    namespace: '',
    required: true
  },

  render: args => {
    const [value, onChange] = useState('')

    return (
      <div>
        <TextInput {...args} value={value} onChange={onChange} />
      </div>
    )
  }
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    placeholder: 'John Doe',
    value: '',
    namespace: '',
    required: false,
    variant: 'plain',
    onChange: () => {}
  },

  render: args => {
    const [value, onChange] = useState('')

    return (
      <Flex direction="column" gap="sm">
        <Text asChild color="muted">
          <Flex align="center" gap="sm">
            <Icon height="16" icon="tabler:user" width="16" />
            <Text weight="medium">Username</Text>
          </Flex>
        </Text>
        <TextInput {...args} value={value} onChange={onChange} />
      </Flex>
    )
  }
}
