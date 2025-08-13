import type { Meta, StoryObj } from '@storybook/react'

import ContextMenu from '..'
import ContextMenuItem from './ContextMenuItem'

const meta = {
  component: ContextMenuItem
} satisfies Meta<typeof ContextMenuItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:pencil',
    text: 'Edit',
    onClick: () => {}
  },
  render: props => (
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
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
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
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
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
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
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
  )
}

export const Togglable: Story = {
  args: {
    icon: 'tabler:category',
    text: 'Option',
    onClick: () => {}
  },
  render: props => (
    <ContextMenu>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <ContextMenuItem
            key={i}
            icon={props.icon}
            isToggled={i === 1}
            text={`${props.text} ${i + 1}`}
            onClick={props.onClick}
          />
        ))}
    </ContextMenu>
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
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
  )
}
