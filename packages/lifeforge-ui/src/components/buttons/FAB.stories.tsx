import type { Meta, StoryObj } from '@storybook/react'

import Fab from './FAB'

const meta = {
  component: Fab
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    as: 'button',
    alwaysShow: true,
    icon: 'tabler:plus'
  }
}

export const WithText: Story = {
  args: {
    as: 'button',
    icon: 'tabler:plus',
    alwaysShow: true,
    text: 'Create'
  }
}

export const RedFAB: Story = {
  args: {
    as: 'button',
    icon: 'tabler:plus',
    alwaysShow: true,
    text: 'Create',
    isRed: true
  }
}

export const Loading: Story = {
  args: {
    as: 'button',
    icon: 'tabler:plus',
    alwaysShow: true,
    text: 'Loading',
    isRed: false,
    loading: true
  }
}
