import type { Meta, StoryObj } from '@storybook/react-vite'

import Switch from './Switch'

const meta = {
  component: Switch
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: true,
    onChange: () => {}
  }
}
