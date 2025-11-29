import type { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenu, ContextMenuItem } from '@components/overlays'

import Fab from './FAB'

const meta = {
  component: Fab
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A floating action button (FAB) component for primary actions.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:plus',
    visibilityBreakpoint: false
  },
  render: props => (
    <div className="h-48">
      <Fab {...props} className="fixed right-6 bottom-6" />
    </div>
  )
}

/**
 * A floating action button (FAB) component, integrated with a context menu for additional actions.
 */
export const WithContextMenu: Story = {
  args: {
    icon: 'tabler:plus',
    visibilityBreakpoint: false
  },
  render: props => {
    return (
      <div className="h-48">
        <ContextMenu
          buttonComponent={<Fab {...props} className="static!" />}
          classNames={{
            wrapper: 'w-min! fixed right-6 bottom-6'
          }}
          side="top"
        >
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() => {}}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {}}
          />
        </ContextMenu>
      </div>
    )
  }
}

export const WithVisibilityBreakpoint: Story = {
  args: {
    icon: 'tabler:plus',
    visibilityBreakpoint: 'md'
  },
  render: props => (
    <div className="flex-center relative h-full w-full">
      <p className="text-bg-500 text-lg">
        Resize the viewport to see the FAB hide at the &apos;md&apos; breakpoint
        and below.
      </p>
      <Fab {...props} className="fixed right-6 bottom-6" />
    </div>
  )
}
