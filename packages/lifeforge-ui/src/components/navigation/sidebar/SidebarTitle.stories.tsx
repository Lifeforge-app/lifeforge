import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import SidebarDivider from './SidebarDivider'
import SidebarItem from './SidebarItem'
import SidebarTitle from './SidebarTitle'
import SidebarWrapper from './SidebarWrapper'

const meta = {
  component: SidebarTitle
} satisfies Meta<typeof SidebarTitle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Categories'
  },
  render: props => (
    <BrowserRouter>
      <div className="flex-center h-128 w-full">
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
      </div>
    </BrowserRouter>
  )
}

export const WithActionButton: Story = {
  args: {
    label: 'Categories',
    actionButton: {
      icon: 'tabler:plus',
      onClick: () => {
        alert('Action button clicked!')
      }
    }
  },
  render: props => (
    <BrowserRouter>
      <div className="flex-center h-128 w-full">
        <SidebarWrapper>
          <SidebarTitle {...props} />
          <SidebarItem icon="tabler:category" label="Category 1" />
          <SidebarItem icon="tabler:category" label="Category 2" />
          <SidebarItem icon="tabler:category" label="Category 3" />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}
