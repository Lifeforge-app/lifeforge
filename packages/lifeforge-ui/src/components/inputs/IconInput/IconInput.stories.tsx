import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { IconInput } from './index'

const meta = {
  component: IconInput
} satisfies Meta<typeof IconInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },
  render: args => {
    const [icon, setIcon] = useState('')

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}

export const Required: Story = {
  args: {
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    required: true,
    value: 'tabler:cube'
  },

  render: args => {
    const [icon, setIcon] = useState(args.value)

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },

  render: args => {
    const [icon, setIcon] = useState('')

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg:
      'Invalid icon identifier provided. It should be a valid icon identifier format from Iconify. ',
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },

  render: args => {
    const [icon, setIcon] = useState('')

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg:
      'Invalid icon identifier provided. It should be a valid icon identifier format from Iconify. ',
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    value: ''
  },

  render: args => {
    const [icon, setIcon] = useState('')

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}

export const PlainVariant: Story = {
  args: {
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [icon, setIcon] = useState('')

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg:
      'Invalid icon identifier provided. It should be a valid icon identifier format from Iconify. ',
    label: 'Icon of Something',
    namespace: 'namespace',
    onChange: () => {},
    value: '',
    variant: 'plain'
  },

  render: args => {
    const [icon, setIcon] = useState('')

    return (
      <IconInput {...args} value={icon} onChange={setIcon} />
    )
  }
}
