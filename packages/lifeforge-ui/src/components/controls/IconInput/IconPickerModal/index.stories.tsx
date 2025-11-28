import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/controls'
import { useModalStore } from '@components/modals'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: { setSelectedIcon: () => {} },
    onClose: () => {}
  },
  render: args => {
    const open = useModalStore(state => state.open)

    return (
      <Button icon="tabler:icons" onClick={() => open(Index, args.data)}>
        Open Icon Picker
      </Button>
    )
  }
}
