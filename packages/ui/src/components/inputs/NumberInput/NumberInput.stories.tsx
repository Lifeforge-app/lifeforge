import type { Meta, StoryObj } from '@storybook/react-vite'

import { NumberInput } from './index'

const meta = {
  component: NumberInput,
  title: 'Inputs/NumberInput'
} satisfies Meta<typeof NumberInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    value: 0
  },
  render: args => <NumberInput {...args} />
}

export const Required: Story = {
  args: {
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    required: true,
    value: 0
  },
  render: args => <NumberInput {...args} />
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    value: 42
  },
  render: args => <NumberInput {...args} />
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid age value',
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    value: 0
  },
  render: args => <NumberInput {...args} />
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Invalid age value',
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    value: 42
  },
  render: args => <NumberInput {...args} />
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    value: 42,
    variant: 'plain'
  },
  render: args => <NumberInput {...args} />
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid age value',
    icon: 'tabler:calendar',
    label: 'Age',
    onChange: () => {},
    value: 42,
    variant: 'plain'
  },
  render: args => <NumberInput {...args} />
}
