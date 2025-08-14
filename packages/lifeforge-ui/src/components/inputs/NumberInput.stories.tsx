import type { Meta, StoryObj } from '@storybook/react-vite'

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
    label: 'Price',
    icon: 'tabler:currency-dollar'
  }
}
