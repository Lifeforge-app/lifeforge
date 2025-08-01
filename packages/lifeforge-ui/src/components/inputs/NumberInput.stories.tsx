import type { Meta, StoryObj } from '@storybook/react'

import NumberInput from './NumberInput'

const meta = {
    component: NumberInput
} satisfies Meta<typeof NumberInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        value: 0,
        setValue: () => {},
        namespace: false,
        name: 'Price',
        icon: 'tabler:currency-dollar',
        darker: true,
        placeholder: '8.70'
    }
}
