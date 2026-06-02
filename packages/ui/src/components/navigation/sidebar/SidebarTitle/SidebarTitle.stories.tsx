import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import { Flex } from '@/components/primitives'

import { SidebarDivider } from '../SidebarDivider'
import { SidebarItem } from '../SidebarItem'
import { SidebarWrapper } from '../SidebarWrapper'
import { SidebarTitle } from './index'

const meta = {
  component: SidebarTitle,
  title: 'Navigation/Sidebar/SidebarTitle'
} satisfies Meta<typeof SidebarTitle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Categories'
  },
  render: props => (
    <BrowserRouter>
      <Flex
        align="center"
        justify="center"
        style={{ height: '32rem' }}
        width="100%"
      >
        <SidebarWrapper>
          <SidebarTitle {...props} />
          <SidebarItem icon="tabler:category" label="Category 1" />
          <SidebarItem icon="tabler:category" label="Category 2" />
          <SidebarItem icon="tabler:category" label="Category 3" />
          <SidebarDivider />
          <SidebarTitle label="Items" />
          <SidebarItem icon="tabler:cube" label="Item 1" />
          <SidebarItem icon="tabler:cube" label="Item 2" />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

export const WithActionButton: Story = {
  args: {
    actionButton: {
      icon: 'tabler:plus',
      onClick: () => {
        alert('Action button clicked!')
      }
    },
    label: 'Categories'
  },
  render: props => (
    <BrowserRouter>
      <Flex
        align="center"
        justify="center"
        style={{ height: '32rem' }}
        width="100%"
      >
        <SidebarWrapper>
          <SidebarTitle {...props} />
          <SidebarItem icon="tabler:category" label="Category 1" />
          <SidebarItem icon="tabler:category" label="Category 2" />
          <SidebarItem icon="tabler:category" label="Category 3" />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}
