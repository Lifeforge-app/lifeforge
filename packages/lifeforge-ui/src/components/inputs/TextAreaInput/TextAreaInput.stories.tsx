import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import TextAreaInput from './TextAreaInput'

const meta = {
  component: TextAreaInput
} satisfies Meta<typeof TextAreaInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    value: ''
  },
  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        value={value}
        onChange={onChange}
      />
    )
  }
}

export const Required: Story = {
  args: {
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    required: true,
    value: ''
  },
  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        value={value}
        onChange={onChange}
      />
    )
  }
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    value: ''
  },
  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        disabled
        value={value}
        onChange={onChange}
      />
    )
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Content length limit exceeded',
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    value: ''
  },

  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        value={value}
        onChange={onChange}
      />
    )
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Content length limit exceeded',
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    value: ''
  },

  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        disabled
        value={value}
        onChange={onChange}
      />
    )
  }
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        value={value}
        onChange={onChange}
      />
    )
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Content length limit exceeded',
    icon: 'tabler:text-size',
    label: 'Description',
    onChange: () => {},
    placeholder: 'Something amazing about yourself...',
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [value, onChange] = useState(args.value)

    return (
      <TextAreaInput
        {...args}
        value={value}
        onChange={onChange}
      />
    )
  }
}
