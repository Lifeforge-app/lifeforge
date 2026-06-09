import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@/components/primitives'
import { mockController } from '@/storybook/mockController'

import { LockedScreen } from './LockedScreen'

const meta = {
  component: LockedScreen,
  title: 'Auth/WithMasterPassword/LockedScreen'
} satisfies Meta<typeof LockedScreen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    challengeController: mockController() as never,
    setMasterPassword: () => {},
    verifyController: mockController() as never
  },
  render: props => {
    return (
      <Box height="100vh" minHeight="30rem" position="fixed" width="100vw">
        <LockedScreen {...props} />
      </Box>
    )
  }
}
