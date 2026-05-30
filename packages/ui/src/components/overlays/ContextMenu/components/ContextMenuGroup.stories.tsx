import type { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenu } from '..'
import { ContextMenuGroup } from './ContextMenuGroup'
import { ContextMenuItem } from './ContextMenuItem'

const meta = {
  argTypes: {
    children: {
      control: false
    }
  },
  component: ContextMenuGroup
} satisfies Meta<typeof ContextMenuGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
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
    ),
    icon: 'tabler:cube',
    label: 'Categories'
  },
  render: props => (
    <ContextMenu>
      <ContextMenuGroup {...props} />
    </ContextMenu>
  )
}

export const Togglable: Story = {
  args: {
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
    ),
    icon: 'tabler:cube',
    label: 'Categories'
  },
  render: props => (
    <ContextMenu>
      <ContextMenuGroup {...props} />
    </ContextMenu>
  )
}
