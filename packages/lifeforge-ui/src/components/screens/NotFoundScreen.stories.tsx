import type { Meta, StoryObj } from '@storybook/react-vite'

import NotFoundScreen from './NotFoundScreen'

const meta = {
  component: NotFoundScreen
} satisfies Meta<typeof NotFoundScreen>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A 404 not found screen with default content.
 */
export const Default: Story = {
  args: {},
  render: args => (
    <div className="h-128 w-full">
      <NotFoundScreen {...args} />
    </div>
  )
}

/**
 * A 404 screen with custom title and description.
 */
export const CustomContent: Story = {
  args: {
    title: 'Ooh no! Resource Not Found',
    message:
      'The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  },
  render: args => (
    <div className="min-h-128 w-full">
      <NotFoundScreen {...args} />
    </div>
  )
}
