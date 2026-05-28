import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import { Flex } from '@components/primitives'

import { SidebarItem } from '../SidebarItem'
import { SidebarWrapper } from '../SidebarWrapper'
import { SidebarDivider } from './index'

const meta = {
  component: SidebarDivider
} satisfies Meta<typeof SidebarDivider>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A default sidebar divider with margins.
 */
export const Default: Story = {
  args: {},
  render: props => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem icon="tabler:cube" label="Item 1" />
          <SidebarItem icon="tabler:cube" label="Item 2" />
          <SidebarDivider {...props} />
          <SidebarItem icon="tabler:cube" label="Item 3" />
          <SidebarItem icon="tabler:cube" label="Item 4" />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/**
 * A sidebar divider without margins.
 */
export const WithoutMargins: Story = {
  args: {
    noMargin: true
  },
  render: props => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem icon="tabler:cube" label="Item 1" />
          <SidebarItem icon="tabler:cube" label="Item 2" />
          <SidebarDivider {...props} />
          <SidebarItem icon="tabler:cube" label="Item 3" />
          <SidebarItem icon="tabler:cube" label="Item 4" />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}
