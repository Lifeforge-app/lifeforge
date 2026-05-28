import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/inputs'
import { useModalStore } from 'shared'

import { IconPickerModal } from './index'

const meta = {
  component: IconPickerModal
} satisfies Meta<typeof IconPickerModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: { setSelectedIcon: () => {} },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

    return (
      <Button icon="tabler:icons" onClick={() => open(IconPickerModal, args.data)}>
        Open Icon Picker
      </Button>
    )
  }
}
