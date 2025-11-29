import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/inputs'
import { useModalStore } from '@components/overlays'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClose: () => {},
    data: {
      color: '#ff0000',
      setColor: (color: string) => {
        console.log(color)
      }
    }
  },
  render: args => {
    const open = useModalStore(state => state.open)

    return (
      <Button icon="tabler:palette" onClick={() => open(Index, args.data)}>
        Open Palette Modal
      </Button>
    )
  }
}
