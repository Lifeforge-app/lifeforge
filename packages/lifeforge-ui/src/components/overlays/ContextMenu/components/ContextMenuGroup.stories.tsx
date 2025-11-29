import type { Meta, StoryObj } from '@storybook/react-vite'

import ContextMenu from '..'
import ContextMenuGroup from './ContextMenuGroup'
import ContextMenuItem from './ContextMenuItem'

const meta = {
  component: ContextMenuGroup,
  argTypes: {
    children: {
      control: false
    }
  }
} satisfies Meta<typeof ContextMenuGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:cube',
    label: 'Categories',
    children: (
      <>
        <ContextMenuItem
          icon="tabler:category"
          label="Item 1"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:category"
          label="Item 2"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:category"
          label="Item 3"
          onClick={() => {}}
        />
      </>
    )
  },
  render: props => (
    <ContextMenu classNames={{ menu: 'w-64' }}>
      <ContextMenuGroup {...props} />
    </ContextMenu>
  )
}

export const Togglable: Story = {
  args: {
    icon: 'tabler:cube',
    label: 'Categories',
    children: (
      <>
        <ContextMenuItem
          icon="tabler:category"
          label="Item 1"
          onClick={() => {}}
        />
        <ContextMenuItem
          checked
          icon="tabler:category"
          label="Item 2"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:category"
          label="Item 3"
          onClick={() => {}}
        />
      </>
    )
  },
  render: props => (
    <ContextMenu classNames={{ menu: 'w-64' }}>
      <ContextMenuGroup {...props} />
    </ContextMenu>
  )
}
