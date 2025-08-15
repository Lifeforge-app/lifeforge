import type { Meta, StoryObj } from '@storybook/react-vite'

import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenu/components/ContextMenuItem'
import Fab from './FAB'

const meta = {
  component: Fab
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'tabler:plus'
  }
}

export const WithContextMenu: Story = {
  args: {
    icon: 'tabler:plus'
  },
  render: props => {
    return (
      <ContextMenu
        buttonComponent={<Fab {...props} className="static!" />}
        classNames={{
          wrapper: 'w-min! fixed right-6 bottom-6'
        }}
        side="top"
      >
        <ContextMenuItem icon="tabler:pencil" label="Edit" onClick={() => {}} />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={() => {}}
        />
      </ContextMenu>
    )
  }
}
