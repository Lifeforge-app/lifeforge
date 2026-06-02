import type { Meta, StoryObj } from '@storybook/react-vite'

import { GoBackButton } from './index'

const meta = {
  component: GoBackButton,
  title: 'Navigation/GoBackButton'
} satisfies Meta<typeof GoBackButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: () => {}
  }
}
