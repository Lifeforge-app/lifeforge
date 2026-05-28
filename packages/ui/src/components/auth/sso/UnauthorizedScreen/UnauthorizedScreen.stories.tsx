import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@/components/primitives'

import { UnauthorizedScreen } from '.'

const meta = {
  component: UnauthorizedScreen
} satisfies Meta<typeof UnauthorizedScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    frontendURL: 'https://example.com'
  },
  render: props => (
    <Box height="100vh" minHeight="30rem" position="fixed" width="100vw">
      <UnauthorizedScreen {...props} />
    </Box>
  )
}
