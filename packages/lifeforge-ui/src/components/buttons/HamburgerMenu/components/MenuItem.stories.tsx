import type { Meta, StoryObj } from '@storybook/react'

import HamburgerMenu from '..'
import MenuItem from './MenuItem'

const meta = {
  component: MenuItem
} satisfies Meta<typeof MenuItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:pencil',
    text: 'Edit',
    onClick: () => {}
  },
  render: props => (
    <HamburgerMenu>
      <MenuItem {...props} />
    </HamburgerMenu>
  )
}

export const RedVariant: Story = {
  args: {
    icon: 'tabler:trash',
    text: 'Delete',
    isRed: true,
    onClick: () => {}
  },
  render: props => (
    <HamburgerMenu>
      <MenuItem {...props} />
    </HamburgerMenu>
  )
}

export const Loading: Story = {
  args: {
    icon: 'tabler:pencil',
    text: 'Processing',
    loading: true,
    onClick: () => {}
  },
  render: props => (
    <HamburgerMenu>
      <MenuItem {...props} />
    </HamburgerMenu>
  )
}

export const Disabled: Story = {
  args: {
    icon: 'tabler:pencil',
    text: 'Edit',
    disabled: true,
    onClick: () => {}
  },
  render: props => (
    <HamburgerMenu>
      <MenuItem {...props} />
    </HamburgerMenu>
  )
}

export const Togglable: Story = {
  args: {
    icon: 'tabler:category',
    text: 'Option',
    onClick: () => {}
  },
  render: props => (
    <HamburgerMenu>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <MenuItem
            key={i}
            icon={props.icon}
            isToggled={i === 1}
            text={`${props.text} ${i + 1}`}
            onClick={props.onClick}
          />
        ))}
    </HamburgerMenu>
  )
}

export const RemainsOpenOnClick: Story = {
  args: {
    icon: 'tabler:pencil',
    text: 'Edit',
    preventDefault: true,
    onClick: () => {}
  },
  render: props => (
    <HamburgerMenu>
      <MenuItem {...props} />
    </HamburgerMenu>
  )
}
