import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@components/primitives'

import LoadingScreen from './LoadingScreen'

const meta = {
  component: LoadingScreen
} satisfies Meta<typeof LoadingScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => (
    <Box height="24rem" width="100%">
      <LoadingScreen {...args} />
    </Box>
  )
}

export const WithMessage: Story = {
  args: {
    message: 'Loading your data...'
  },
  render: args => (
    <Box height="24rem" width="100%">
      <LoadingScreen {...args} />
    </Box>
  )
}

export const LongMessage: Story = {
  args: {
    message: 'Please wait while we load your content. This may take a moment.'
  },
  render: args => (
    <Box height="24rem" width="100%">
      <LoadingScreen {...args} />
    </Box>
  )
}
