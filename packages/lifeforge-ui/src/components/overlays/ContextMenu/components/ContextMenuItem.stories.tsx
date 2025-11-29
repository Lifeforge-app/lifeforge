import type { Meta, StoryObj } from '@storybook/react-vite'

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
    label: 'Edit',
    onClick: () => {}
  },
  render: props => (
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
  )
}

export const Dangerous: Story = {
  args: {
    icon: 'tabler:trash',
    label: 'Delete',
    dangerous: true,
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
    label: 'Processing',
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
    icon: 'tabler:mood-angry',
    label: 'DO NOT CLICK ME',
    disabled: true,
    onClick: () => {}
  },
  render: props => (
    <ContextMenu>
      <ContextMenuItem {...props} />
      <ContextMenuItem
        icon="tabler:mood-happy"
        label="Yay"
        onClick={() => {}}
      />
    </ContextMenu>
  )
}

export const Togglable: Story = {
  args: {
    icon: 'tabler:category',
    label: 'Option',
    onClick: () => {}
  },
  render: props => (
    <ContextMenu>
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <ContextMenuItem
            key={i}
            checked={i === 1}
            icon={props.icon}
            label={`${props.label} ${i + 1}`}
            onClick={props.onClick}
          />
        ))}
    </ContextMenu>
  )
}

export const RemainsOpenOnClick: Story = {
  args: {
    icon: 'tabler:pointer',
    label: 'Do Something',
    shouldCloseMenuOnClick: false,
    onClick: () => {}
  },
  render: props => (
    <ContextMenu>
      <ContextMenuItem {...props} />
    </ContextMenu>
  )
}
