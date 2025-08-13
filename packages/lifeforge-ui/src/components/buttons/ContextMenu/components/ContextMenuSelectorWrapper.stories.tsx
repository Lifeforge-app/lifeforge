import type { Meta, StoryObj } from '@storybook/react'

import ContextMenu from '..'
import ContextMenuItem from './ContextMenuItem'
import ContextMenuSelectorWrapper from './ContextMenuSelectorWrapper'

const meta = {
  component: ContextMenuSelectorWrapper
} satisfies Meta<typeof ContextMenuSelectorWrapper>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Categories',
    children: (
      <>
        <ContextMenuItem
          icon="tabler:category"
          text="Item 1"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:category"
          text="Item 2"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:category"
          text="Item 3"
          onClick={() => {}}
        />
      </>
    )
  },
  render: props => (
    <ContextMenu classNames={{ menu: 'w-64' }}>
      <ContextMenuSelectorWrapper {...props} />
    </ContextMenu>
  )
}

export const Togglable: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Categories',
    children: (
      <>
        <ContextMenuItem
          icon="tabler:category"
          text="Item 1"
          onClick={() => {}}
        />
        <ContextMenuItem
          isToggled
          icon="tabler:category"
          text="Item 2"
          onClick={() => {}}
        />
        <ContextMenuItem
          icon="tabler:category"
          text="Item 3"
          onClick={() => {}}
        />
      </>
    )
  },
  render: props => (
    <ContextMenu classNames={{ menu: 'w-64' }}>
      <ContextMenuSelectorWrapper {...props} />
    </ContextMenu>
  )
}
