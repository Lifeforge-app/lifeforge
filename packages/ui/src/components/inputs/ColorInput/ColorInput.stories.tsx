import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { ColorInput } from './index'

const meta = {
  component: ColorInput,
  title: 'Inputs/ColorInput'
} satisfies Meta<typeof ColorInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}

export const Required: Story = {
  args: {
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    required: true,
    value: ''
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid color hex provided',
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Invalid color hex provided',
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}

export const PlainVariant: Story = {
  args: {
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid color hex provided',
    label: 'Cube Color',
    namespace: 'namespace',
    onChange: () => {},
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [color, setColor] = useState<string>('')

    return <ColorInput {...args} value={color} onChange={setColor} />
  }
}
