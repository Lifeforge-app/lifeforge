import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { BrowserRouter } from 'react-router'

import { ContextMenuItem } from '@components/overlays'
import { Flex, Text } from '@components/primitives'

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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
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
      <Flex align="center" height="24rem" justify="center" width="100%">
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
      </Flex>
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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a number badge and a context menu, demonstrating the badge hiding on hover when a context menu is present. */
export const WithNumberBadgeAndContextMenu: Story = {
  args: {
    label: 'Messages',
    icon: 'tabler:message',
    number: 5,
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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
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
        <Flex align="center" height="24rem" justify="center" width="100%">
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
        </Flex>
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
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a custom image icon. */
export const WithCustomImageIcon: Story = {
  args: {
    label: 'Custom Image',
    icon: 'url:https://img.liaobagua.com/uploads/article/20230706/1688654584154696.jpg'
  },
  render: args => {
    const [active, setActive] = useState(false)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <Index
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
    label: 'Lorem Ipsum Dolor Sit Amet Consectectur Adisiplin Elit',
    icon: 'tabler:home'
  },

  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a React element as the label. */
export const WithReactElementLabel: Story = {
  args: {
    label: 'Custom Label',
    icon: 'tabler:star'
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index
            {...args}
            label={
              <Flex align="center" style={{ gap: '0.5rem' }}>
                <Text color={{ base: 'bg-800', dark: 'bg-50' }}>Custom</Text>
                <Text
                  color="custom-500"
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
    label: 'Dashboard',
    icon: 'tabler:home',
    active: true
  },
  render: args => (
    <BrowserRouter>
      <Flex align="center" height="24rem" justify="center" width="100%">
        <SidebarWrapper>
          <Index {...args} />
        </SidebarWrapper>
      </Flex>
    </BrowserRouter>
  )
}

/** A sidebar item with a number badge while active (badge is hidden in favour of the cancel button). */
export const WithNumberBadgeAndActiveState: Story = {
  args: {
    label: 'Notifications',
    icon: 'tabler:bell',
    number: 12,
    active: true,
    onCancelButtonClick: () => alert('Cancel clicked!')
  },
  render: args => {
    const [active, setActive] = useState(true)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <Index
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
    label: 'Projects',
    icon: 'tabler:folder',
    onClick: 'expand'
  },
  render: args => {
    const [activeItem, setActiveItem] = useState<string | null>(null)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <Index
              {...args}
              namespace={false}
              subsection={[
                {
                  label: 'Website Redesign',
                  icon: 'tabler:device-desktop',
                  active: activeItem === 'website',
                  namespace: false,
                  onClick: () => setActiveItem('website')
                },
                {
                  label: 'Mobile App',
                  icon: 'tabler:device-mobile',
                  active: activeItem === 'mobile',
                  namespace: false,
                  onClick: () => setActiveItem('mobile')
                },
                {
                  label: 'Backend API',
                  icon: 'tabler:server',
                  active: activeItem === 'api',
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
    number: 17,
    label: 'Inbox',
    icon: 'tabler:inbox'
  },
  render: args => {
    const [activeItem, setActiveItem] = useState<string | null>(null)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <Index
              {...args}
              namespace={false}
              subsection={[
                {
                  label: 'Unread',
                  icon: 'tabler:mail',
                  active: activeItem === 'unread',
                  namespace: false,
                  amount: 14,
                  onClick: () => setActiveItem('unread')
                },
                {
                  label: 'Starred',
                  icon: 'tabler:star',
                  active: activeItem === 'starred',
                  namespace: false,
                  amount: 3,
                  onClick: () => setActiveItem('starred')
                },
                {
                  label: 'Sent',
                  icon: 'tabler:send',
                  active: activeItem === 'sent',
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
    label: 'Workspace Alpha',
    icon: 'tabler:building',
    sideStripColor: '#7C3AED',
    number: 8,
    actionButtonProps: {
      icon: 'tabler:plus',
      onClick: () => alert('Action button clicked!')
    },
    subsection: [
      {
        label: 'General',
        icon: 'tabler:hash',
        active: false,
        namespace: false,
        onClick: () => alert('General clicked!')
      },
      {
        label: 'Random',
        icon: 'tabler:hash',
        active: false,
        namespace: false,
        onClick: () => alert('Random clicked!')
      }
    ],
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
    )
  },
  render: args => {
    const [active, setActive] = useState(true)

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <Index
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
    label: 'State Comparison',
    icon: 'tabler:layout-dashboard'
  },
  render: () => {
    const [active, setActive] = useState<string | null>('b')

    return (
      <BrowserRouter>
        <Flex align="center" height="24rem" justify="center" width="100%">
          <SidebarWrapper>
            <Index
              icon="tabler:circle"
              label="Default (inactive)"
              namespace={false}
              onClick={() => setActive('a')}
            />
            <Index
              active={active === 'b'}
              icon="tabler:circle-filled"
              label="Active (no cancel)"
              namespace={false}
              onClick={() => setActive('b')}
            />
            <Index
              active={active === 'c'}
              icon="tabler:circle-check"
              label="Active with cancel"
              namespace={false}
              onCancelButtonClick={() => setActive(null)}
              onClick={() => setActive('c')}
            />
            <Index
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
