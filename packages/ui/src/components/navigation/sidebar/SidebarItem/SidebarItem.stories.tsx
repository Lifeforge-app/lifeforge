import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BrowserRouter } from 'react-router'

import { ContextMenuItem } from '@/components/overlays'
import { Flex, Text } from '@/components/primitives'
import { TAILWIND_PALETTE } from '@/system'

import { SidebarWrapper } from '../SidebarWrapper'
import { SidebarItem } from './index'

const meta = {
  argTypes: {
    contextMenuItems: {
      control: false,
      table: {
        type: { summary: 'React.ReactElement' }
      }
    },
    icon: {
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactElement' }
      }
    },
    label: {
      control: 'text',
      table: {
        type: { summary: 'string | React.ReactElement' }
      }
    }
  },
  component: SidebarItem,
  title: 'Navigation/Sidebar/SidebarItem'
} satisfies Meta<typeof SidebarItem>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A default sidebar item with an icon and label.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:home',
    label: 'Dashboard'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a colored strip on the side. */
export const WithSideColorStrip: Story = {
  args: {
    icon: 'tabler:category',
    label: 'Dashboard',
    sideStripColor: TAILWIND_PALETTE.indigo[600]
  },
  render: () => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          {[
            ['Category 1', TAILWIND_PALETTE.indigo[600]],
            ['Category 2', TAILWIND_PALETTE.green[600]],
            ['Category 3', TAILWIND_PALETTE.red[600]]
          ].map(([label, color]) => (
            <SidebarItem
              key={label}
              icon="tabler:category"
              label={label}
              sideStripColor={color}
            />
          ))}
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with an action button. */
export const WithActionButton: Story = {
  args: {
    actionButtonProps: {
      icon: 'tabler:plus',
      onClick: () => alert('Action button clicked!')
    },
    icon: 'tabler:home',
    label: 'Dashboard'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a context menu. */
export const WithContextMenu: Story = {
  args: {
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
    ),
    icon: 'tabler:cube',
    label: 'An Item'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with both an action button and a context menu. */
export const WithContextMenuAndActionButton: Story = {
  args: {
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
    ),
    icon: 'tabler:cube',
    label: 'An Item'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a number badge. */
export const WithNumberBadge: Story = {
  args: {
    icon: 'tabler:bell',
    label: 'Notifications',
    number: 42
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a number badge and a context menu, demonstrating the badge hiding on hover when a context menu is present. */
export const WithNumberBadgeAndContextMenu: Story = {
  args: {
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
    ),
    icon: 'tabler:message',
    label: 'Messages',
    number: 5
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A list of sidebar items demonstrating active state and cancel button functionality. */
export const WithActiveState: Story = {
  args: {
    active: true,
    icon: 'tabler:category',
    label: 'Category',
    onCancelButtonClick: () => alert('Cancel button clicked!')
  },
  render: () => {
    const [activeCategory, setActiveCategory] = useState<string | null>('a')

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            {['a', 'b', 'c'].map(cat => (
              <SidebarItem
                key={cat}
                active={activeCategory === cat}
                icon="tabler:category"
                label={`Category ${cat.toUpperCase()}`}
                onCancelButtonClick={() => setActiveCategory(null)}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}

/** A sidebar item with a custom SVG icon. */
export const WithCustomSVGIcon: Story = {
  args: {
    icon: "customHTML:<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' class='feather feather-star'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/></svg>",
    label: 'Custom Icon'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a custom image icon. */
export const WithCustomImageIcon: Story = {
  args: {
    icon: 'url:https://img.liaobagua.com/uploads/article/20230706/1688654584154696.jpg',
    label: 'Custom Image'
  },
  render: args => {
    const [active, setActive] = useState(false)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <SidebarItem
              {...args}
              active={active}
              onClick={() => setActive(!active)}
            />
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}

export const AVeryLongName: Story = {
  args: {
    icon: 'tabler:home',
    label: 'Lorem Ipsum Dolor Sit Amet Consectectur Adisiplin Elit'
  },

  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a React element as the label. */
export const WithReactElementLabel: Story = {
  args: {
    icon: 'tabler:star',
    label: 'Custom Label'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem
            {...args}
            label={
              <Flex align="center" style={{ gap: '0.5rem' }}>
                <Text color={{ base: 'bg-800', dark: 'bg-50' }}>Custom</Text>
                <Text
                  color="primary"
                  style={{
                    borderRadius: '0.25rem',
                    fontSize: '0.625rem',
                    padding: '0.125rem 0.375rem'
                  }}
                  weight="semibold"
                >
                  BETA
                </Text>
              </Flex>
            }
          />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item that is active but has no cancel button. */
export const WithActiveStateNoCancel: Story = {
  args: {
    active: true,
    icon: 'tabler:home',
    label: 'Dashboard'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <SidebarItem {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a number badge while active (badge is hidden in favour of the cancel button). */
export const WithNumberBadgeAndActiveState: Story = {
  args: {
    active: true,
    icon: 'tabler:bell',
    label: 'Notifications',
    number: 12,
    onCancelButtonClick: () => alert('Cancel clicked!')
  },
  render: args => {
    const [active, setActive] = useState(true)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <SidebarItem
              {...args}
              active={active}
              onCancelButtonClick={() => setActive(false)}
              onClick={() => setActive(true)}
            />
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}

/** A sidebar item with an expandable subsection. Click to toggle. */
export const WithSubsection: Story = {
  args: {
    icon: 'tabler:folder',
    label: 'Projects',
    onClick: 'expand'
  },
  render: args => {
    const [activeItem, setActiveItem] = useState<string | null>(null)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <SidebarItem
              {...args}
              namespace={false}
              subsection={[
                {
                  active: activeItem === 'website',
                  icon: 'tabler:device-desktop',
                  label: 'Website Redesign',
                  namespace: false,
                  onClick: () => setActiveItem('website')
                },
                {
                  active: activeItem === 'mobile',
                  icon: 'tabler:device-mobile',
                  label: 'Mobile App',
                  namespace: false,
                  onClick: () => setActiveItem('mobile')
                },
                {
                  active: activeItem === 'api',
                  icon: 'tabler:server',
                  label: 'Backend API',
                  namespace: false,
                  onClick: () => setActiveItem('api')
                }
              ]}
            />
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}

/** A sidebar item with a subsection where items have amount badges. */
export const WithSubsectionAndAmounts: Story = {
  args: {
    icon: 'tabler:inbox',
    label: 'Inbox',
    number: 17
  },
  render: args => {
    const [activeItem, setActiveItem] = useState<string | null>(null)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <SidebarItem
              {...args}
              namespace={false}
              subsection={[
                {
                  active: activeItem === 'unread',
                  amount: 14,
                  icon: 'tabler:mail',
                  label: 'Unread',
                  namespace: false,
                  onClick: () => setActiveItem('unread')
                },
                {
                  active: activeItem === 'starred',
                  amount: 3,
                  icon: 'tabler:star',
                  label: 'Starred',
                  namespace: false,
                  onClick: () => setActiveItem('starred')
                },
                {
                  active: activeItem === 'sent',
                  icon: 'tabler:send',
                  label: 'Sent',
                  namespace: false,
                  onClick: () => setActiveItem('sent')
                }
              ]}
            />
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}

/** A sidebar item combining side strip, number badge, action button, and context menu. */
export const WithAllFeatures: Story = {
  args: {
    actionButtonProps: {
      icon: 'tabler:plus',
      onClick: () => alert('Action button clicked!')
    },
    contextMenuItems: (
      <>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Rename"
          onClick={() => alert('Rename clicked!')}
        />
        <ContextMenuItem
          icon="tabler:settings"
          label="Settings"
          onClick={() => alert('Settings clicked!')}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => alert('Delete clicked!')}
        />
      </>
    ),
    icon: 'tabler:building',
    label: 'Workspace Alpha',
    number: 8,
    sideStripColor: TAILWIND_PALETTE.violet[600],
    subsection: [
      {
        active: false,
        icon: 'tabler:hash',
        label: 'General',
        namespace: false,
        onClick: () => alert('General clicked!')
      },
      {
        active: false,
        icon: 'tabler:hash',
        label: 'Random',
        namespace: false,
        onClick: () => alert('Random clicked!')
      }
    ]
  },
  render: args => {
    const [active, setActive] = useState(true)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <SidebarItem
              {...args}
              active={active}
              onCancelButtonClick={() => setActive(false)}
              onClick={() => setActive(true)}
            />
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}

/** Side-by-side comparison of all visual states: default, active, active with cancel. */
export const AllStatesComparison: Story = {
  args: {
    icon: 'tabler:layout-dashboard',
    label: 'State Comparison'
  },
  render: () => {
    const [active, setActive] = useState<string | null>('b')

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <SidebarItem
              icon="tabler:circle"
              label="Default (inactive)"
              namespace={false}
              onClick={() => setActive('a')}
            />
            <SidebarItem
              active={active === 'b'}
              icon="tabler:circle-filled"
              label="Active (no cancel)"
              namespace={false}
              onClick={() => setActive('b')}
            />
            <SidebarItem
              active={active === 'c'}
              icon="tabler:circle-check"
              label="Active with cancel"
              namespace={false}
              onCancelButtonClick={() => setActive(null)}
              onClick={() => setActive('c')}
            />
            <SidebarItem
              active={active === 'd'}
              icon="tabler:circle-dashed"
              label="With number badge"
              namespace={false}
              number={5}
              onClick={() => setActive('d')}
            />
          </SidebarWrapper>
        </Flex>
      </BrowserRouter>
    )
  }
}
