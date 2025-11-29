import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BrowserRouter } from 'react-router'

import { ContextMenuItem } from '@components/overlays'

import SidebarWrapper from '../SidebarWrapper'
import Index from './index'

const meta = {
  component: Index,
  argTypes: {
    label: {
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactElement' }
      }
    },
    icon: {
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactElement' }
      }
    },
    contextMenuItems: {
      control: false,
      table: {
        type: { summary: 'React.ReactElement' }
      }
    }
  }
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A default sidebar item with an icon and label.
 */
export const Default: Story = {
  args: {
    label: 'Dashboard',
    icon: 'tabler:home'
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A sidebar item with a colored strip on the side. */
export const WithSideColorStrip: Story = {
  args: {
    label: 'Dashboard',
    icon: 'tabler:category',
    sideStripColor: '#4F46E5'
  },
  render: () => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          {[
            ['Category 1', '#4F46E5'],
            ['Category 2', '#16A34A'],
            ['Category 3', '#DC2626']
          ].map(([label, color]) => (
            <Index
              key={label}
              icon="tabler:category"
              label={label}
              sideStripColor={color}
            />
          ))}
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A sidebar item with an action button. */
export const WithActionButton: Story = {
  args: {
    label: 'Dashboard',
    icon: 'tabler:home',
    actionButtonProps: {
      icon: 'tabler:plus',
      onClick: () => alert('Action button clicked!')
    }
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A sidebar item with a context menu. */
export const WithContextMenu: Story = {
  args: {
    label: 'An Item',
    icon: 'tabler:cube',
    contextMenuItems: (
      <>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={() => alert('Edit clicked!')}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => alert('Delete clicked!')}
        />
      </>
    )
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A sidebar item with both an action button and a context menu. */
export const WithContextMenuAndActionButton: Story = {
  args: {
    label: 'An Item',
    icon: 'tabler:cube',
    actionButtonProps: {
      icon: 'tabler:plus',
      onClick: () => alert('Action button clicked!')
    },
    contextMenuItems: (
      <>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={() => alert('Edit clicked!')}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => alert('Delete clicked!')}
        />
      </>
    )
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A sidebar item with a number badge. */
export const WithNumberBadge: Story = {
  args: {
    label: 'Notifications',
    icon: 'tabler:bell',
    number: 42
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A list of sidebar items demonstrating active state and cancel button functionality. */
export const WithActiveState: Story = {
  args: {
    label: 'Category',
    icon: 'tabler:category',
    active: true,
    onCancelButtonClick: () => alert('Cancel button clicked!')
  },
  render: () => {
    const [activeCategory, setActiveCategory] = useState<string | null>('a')

    return (
      <BrowserRouter>
        <div className="flex-center h-96 w-full">
          <SidebarWrapper>
            {['a', 'b', 'c'].map(cat => (
              <Index
                key={cat}
                active={activeCategory === cat}
                icon="tabler:category"
                label={`Category ${cat.toUpperCase()}`}
                onCancelButtonClick={() => setActiveCategory(null)}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </SidebarWrapper>
        </div>
      </BrowserRouter>
    )
  }
}

/** A sidebar item with a custom SVG icon. */
export const WithCustomSVGIcon: Story = {
  args: {
    label: 'Custom Icon',
    icon: "customHTML:<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>"
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}

/** A sidebar item with a custom image icon. */
export const WithCustomImageIcon: Story = {
  args: {
    label: 'Custom Image',
    icon: 'url:https://img.liaobagua.com/uploads/article/20230706/1688654584154696.jpg'
  },
  render: args => (
    <BrowserRouter>
      <div className="flex-center h-96 w-full">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </div>
    </BrowserRouter>
  )
}
