import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Flex, Icon, Text } from '@/components/primitives'

import { TextInput } from './index'

const meta = {
  argTypes: {
    actionButtonProps: {
      table: {
        type: {
          summary: 'ButtonProps'
        }
      }
    }
  },
  component: TextInput
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    required: false,
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return <TextInput {...args} value={value} onChange={onChange} />
  }
}

export const PasswordInput: Story = {
  args: {
    icon: 'tabler:key',
    isPassword: true,
    label: 'Password',
    onChange: () => {},
    placeholder: 'Type your password here',
    value: ''
  },

  render: args => {
    const [value, onChange] = useState('')

    return <TextInput {...args} value={value} onChange={onChange} />
  }
}

export const WithActionButton: Story = {
  args: {
    actionButtonProps: {
      icon: 'tabler:scan',
      onClick: () => {}
    },
    icon: 'tabler:barcode',
    label: 'Barcode',
    onChange: () => {},
    placeholder: '0123456789',
    value: ''
  },

  render: args => {
    const [value, onChange] = useState('')

    return <TextInput {...args} value={value} onChange={onChange} />
  }
}

export const Required: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    required: true,
    value: ''
  },

  render: args => {
    const [value, onChange] = useState('')

    return <TextInput {...args} value={value} onChange={onChange} />
  }
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    value: 'Existing value'
  },
  render: args => {
    const [value, onChange] = useState('Existing value')

    return <TextInput {...args} disabled value={value} onChange={onChange} />
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid username',
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    value: ''
  },
  render: args => {
    const [value, onChange] = useState('')

    return <TextInput {...args} value={value} onChange={onChange} />
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Invalid username',
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    value: 'Existing value'
  },
  render: args => {
    const [value, onChange] = useState('Existing value')

    return <TextInput {...args} disabled value={value} onChange={onChange} />
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid username',
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    required: false,
    value: '',
    variant: 'plain'
  },
  render: args => {
    const [value, onChange] = useState('')

    return (
      <Flex direction="column" gap="sm">
        <Text asChild color="muted">
          <Flex align="center" gap="sm">
            <Icon icon="tabler:user" size="1em" />
            <Text weight="medium">Username</Text>
          </Flex>
        </Text>
        <TextInput {...args} value={value} onChange={onChange} />
      </Flex>
    )
  }
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:user',
    label: 'Username',
    namespace: '',
    onChange: () => {},
    placeholder: 'John Doe',
    required: false,
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [value, onChange] = useState('')

    return (
      <Flex direction="column" gap="sm">
        <Text asChild color="muted">
          <Flex align="center" gap="sm">
            <Icon icon="tabler:user" size="1em" />
            <Text weight="medium">Username</Text>
          </Flex>
        </Text>
        <TextInput {...args} value={value} onChange={onChange} />
      </Flex>
    )
  }
}
