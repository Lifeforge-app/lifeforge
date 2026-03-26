import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@components/primitives'

import NotFoundScreen from './NotFoundScreen'

const meta = {
  component: NotFoundScreen
} satisfies Meta<typeof NotFoundScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: args => (
    <Box height="32rem" width="100%">
      <NotFoundScreen {...args} />
    </Box>
  )
}

export const CustomContent: Story = {
  args: {
    title: 'Ooh no! Resource Not Found',
    message:
      'The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.'
  },
  render: args => (
    <Box minHeight="32rem" width="100%">
      <NotFoundScreen {...args} />
    </Box>
  )
}
