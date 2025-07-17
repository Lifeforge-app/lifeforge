import type { Meta, StoryObj } from '@storybook/react'

import { ModalWrapper } from '@components/modals'

import MorandiColorPaletteModal from './MorandiColorPaletteModal'

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
