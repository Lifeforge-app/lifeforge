import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@components/primitives'

import { SSOHeader } from '.'

const meta = {
  component: SSOHeader
} satisfies Meta<typeof SSOHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    actionButtonProps: {
      children: 'Settings',
      icon: 'tabler:settings'
    },
    icon: 'tabler:world',
    link: 'https://github.com',
    namespace: 'common.misc'
  },
  render: props => (
    <Box height="100vh" minHeight="30rem" position="fixed" width="100vw">
      <SSOHeader {...props} />
    </Box>
  )
}
