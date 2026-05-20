import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@components/primitives'

import { mockController } from '../../../../storybook/mockController'
import CreatePasswordScreen from './CreatePasswordScreen'

const meta = {
  component: CreatePasswordScreen
} satisfies Meta<typeof CreatePasswordScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    challengeController: mockController() as never,
    controller: mockController() as never
  },
  render: props => (
    <Box height="100vh" minHeight="30rem" position="fixed" width="100vw">
      <CreatePasswordScreen {...props} />
    </Box>
  )
}
