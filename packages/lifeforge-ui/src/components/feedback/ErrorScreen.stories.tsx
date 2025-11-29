import type { Meta, StoryObj } from '@storybook/react-vite'

import ErrorScreen from './ErrorScreen'

const meta = {
  component: ErrorScreen,
  argTypes: {
    message: {
      control: false,
      table: {
        type: {
          summary: 'string | React.ReactNode'
        }
      }
    },
    showRetryButton: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof ErrorScreen>

export default meta

type Story = StoryObj<typeof meta>

/**
 * An error screen without retry button.
 */
export const Default: Story = {
  args: {
    message: 'Something went wrong. Please try again later.'
  },
  render: args => (
    <div className="h-96 w-full">
      <ErrorScreen {...args} />
    </div>
  )
}

/**
 * An error screen with retry button.
 */
export const WithRetryButton: Story = {
  args: {
    message: 'Failed to load data. Please try again.',
    showRetryButton: true
  },
  render: args => (
    <div className="h-96 w-full">
      <ErrorScreen {...args} />
    </div>
  )
}

/**
 * An error screen with a network error message.
 */
export const NetworkError: Story = {
  args: {
    message: 'Network connection lost. Please check your internet connection.',
    showRetryButton: true
  },
  render: args => (
    <div className="h-96 w-full">
      <ErrorScreen {...args} />
    </div>
  )
}

/**
 * An error screen with a server error message.
 */
export const ServerError: Story = {
  args: {
    message: (
      <>
        Internal server error occurred.
        <br />
        If you are the developer, please check the server logs for more details.
      </>
    )
  },
  render: args => (
    <div className="h-96 w-full">
      <ErrorScreen {...args} />
    </div>
  )
}
