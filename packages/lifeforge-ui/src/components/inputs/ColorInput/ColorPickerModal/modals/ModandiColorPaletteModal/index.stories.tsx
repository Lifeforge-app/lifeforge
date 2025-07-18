import { ModalWrapper } from '@components/modals'
import type { Meta, StoryObj } from '@storybook/react'

import MorandiColorPaletteModal from '.'

const meta = {
  component: MorandiColorPaletteModal
} satisfies Meta<typeof MorandiColorPaletteModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: {
      color: 'color',
      setColor: () => {}
    },
    onClose: () => {}
  },
  render: args => {
    return (
      <ModalWrapper isOpen={true}>
        <MorandiColorPaletteModal {...args} />
      </ModalWrapper>
    )
  }
}
