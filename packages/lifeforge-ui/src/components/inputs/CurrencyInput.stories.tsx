import type { Meta, StoryObj } from '@storybook/react'

import CurrencyInput from './CurrencyInput'

const meta = {
    component: CurrencyInput
} satisfies Meta<typeof CurrencyInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        reference: {},
        name: 'Price',
        placeholder: '8.70',
        icon: 'tabler:currency-dollar',
        value: 0,
        setValue: () => {},
        namespace: false,
        darker: true
    }
}
