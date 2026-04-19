import type { Meta, StoryObj } from '@storybook/react-vite'

import CurrencyInput from '../CurrencyInput'

const meta = {
  component: CurrencyInput
} satisfies Meta<typeof CurrencyInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Price',
    placeholder: '8.70',
    icon: 'tabler:currency-dollar',
    value: 0,
    onChange: () => {},
    prefix: '',
    variant: 'classic'
  }
}

export const WithErrorState: Story = {
  args: {
    label: 'Price',
    placeholder: '8.70',
    icon: 'tabler:currency-dollar',
    onChange: () => {},
    value: 0,
    errorMsg: 'Invalid price value.'
  }
}

export const WithCurrencyPrefix: Story = {
  args: {
    label: 'Price',
    placeholder: '8.70',
    icon: 'tabler:currency-dollar',
    value: 87.69,
    onChange: () => {},
    prefix: 'MYR',
    variant: 'classic'
  }
}

export const PlainVariant: Story = {
  args: {
    label: 'Price',
    placeholder: '8.70',
    icon: 'tabler:currency-dollar',
    value: 87.69,
    onChange: () => {},
    prefix: 'MYR',
    variant: 'plain'
  }
}
