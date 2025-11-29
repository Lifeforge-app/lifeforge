import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import SidebarDivider from './SidebarDivider'
import SidebarItem from './SidebarItem'
import SidebarWrapper from './SidebarWrapper'

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
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <SidebarItem icon="tabler:cube" label="Item 1" />
          <SidebarItem icon="tabler:cube" label="Item 2" />
          <SidebarDivider {...props} />
          <SidebarItem icon="tabler:cube" label="Item 3" />
          <SidebarItem icon="tabler:cube" label="Item 4" />
        </SidebarWrapper>
      </div>
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
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <SidebarItem icon="tabler:cube" label="Item 1" />
          <SidebarItem icon="tabler:cube" label="Item 2" />
          <SidebarDivider {...props} />
          <SidebarItem icon="tabler:cube" label="Item 3" />
          <SidebarItem icon="tabler:cube" label="Item 4" />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}
