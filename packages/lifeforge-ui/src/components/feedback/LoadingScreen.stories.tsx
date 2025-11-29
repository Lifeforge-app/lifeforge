import type { Meta, StoryObj } from '@storybook/react-vite'

import LoadingScreen from './LoadingScreen'

const meta = {
  component: LoadingScreen
} satisfies Meta<typeof LoadingScreen>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A loading screen with just the default spinner.
 */
export const Default: Story = {
  args: {},
  render: args => (
    <div className="h-96 w-full">
      <LoadingScreen {...args} />
    </div>
  )
}

/**
 * A loading screen with custom message.
 */
export const WithMessage: Story = {
  args: {
    message: 'Loading your data...'
  },
  render: args => (
    <div className="h-96 w-full">
      <LoadingScreen {...args} />
    </div>
  )
}

/**
 * A loading screen with longer custom message.
 */
export const LongMessage: Story = {
  args: {
    message: 'Please wait while we load your content. This may take a moment.'
  },
  render: args => (
    <div className="h-96 w-full">
      <LoadingScreen {...args} />
    </div>
  )
}
