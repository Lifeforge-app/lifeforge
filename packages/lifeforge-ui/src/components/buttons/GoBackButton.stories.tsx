import type { Meta, StoryObj } from '@storybook/react'

import GoBackButton from './GoBackButton'

const meta = {
  component: GoBackButton
} satisfies Meta<typeof GoBackButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClick: () => {}
  }
}
