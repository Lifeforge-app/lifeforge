import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/inputs'
import { useModalStore } from 'shared'

import { FlatUIColorsModal } from './index'

const meta = {
  component: FlatUIColorsModal
} satisfies Meta<typeof FlatUIColorsModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: {
      color: '#ff0000',
      setColor: (color: string) => {
        alert(color)
      }
    },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

    return (
      <Button icon="tabler:palette" onClick={() => open(FlatUIColorsModal, args.data)}>
        Open Palette Modal
      </Button>
    )
  }
}
