import type { Meta, StoryObj } from '@storybook/react-vite'

import CurrencyInput from '../CurrencyInput'

const meta = {
  component: CurrencyInput
} satisfies Meta<typeof CurrencyInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    prefix: '',
    value: 0,
    variant: 'classic'
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const WithCurrencyPrefix: Story = {
  args: {
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    prefix: 'MYR',
    value: 87.69,
    variant: 'classic'
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const Required: Story = {
  args: {
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    required: true,
    value: 0
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const Disabled: Story = {
  args: {
    disabled: true,
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    value: 42.5
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const WithErrorMessage: Story = {
  args: {
    errorMsg: 'Invalid price value.',
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    value: 0
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const DisabledWithErrorMessage: Story = {
  args: {
    disabled: true,
    errorMsg: 'Invalid price value.',
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    value: 42.5
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const PlainVariant: Story = {
  args: {
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    prefix: 'MYR',
    value: 87.69,
    variant: 'plain'
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}

export const PlainVariantWithErrorMessage: Story = {
  args: {
    errorMsg: "The amount you've entered is ridiculous lol",
    icon: 'tabler:currency-dollar',
    label: 'Price',
    onChange: () => {},
    placeholder: '8.70',
    prefix: 'MYR',
    value: 87.69,
    variant: 'plain'
  },
  render: args => (
    <CurrencyInput {...args} />
  )
}
