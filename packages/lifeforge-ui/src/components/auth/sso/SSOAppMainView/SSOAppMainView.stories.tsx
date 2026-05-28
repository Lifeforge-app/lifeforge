import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@components/primitives'

import { SSOAppMainView } from '.'

const meta = {
  component: SSOAppMainView
} satisfies Meta<typeof SSOAppMainView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <div />,
    config: {
      apiEndpoint: 'https://api.example.com',
      forgeAPI: {} as never,
      frontendURL: 'https://example.com',
      icon: 'tabler:world',
      link: 'https://github.com',
      namespace: 'common.misc'
    }
  },
  render: props => (
    <Box height="100vh" minHeight="30rem" position="fixed" width="100vw">
      <SSOAppMainView {...props} />
    </Box>
  )
}
