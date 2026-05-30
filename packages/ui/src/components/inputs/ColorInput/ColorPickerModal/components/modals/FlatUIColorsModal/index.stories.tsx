import type { Meta, StoryObj } from '@storybook/react-vite'

import { ModalWrapper } from '@/components/overlays'

import { FlatUIColorsModal } from './index'

const meta = {
  component: FlatUIColorsModal
} satisfies Meta<typeof FlatUIColorsModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: { color: '#ff0000', setColor: () => {} },
    onClose: () => {}
  },
  render: args => {
    return (
      <ModalWrapper isOpen={true}>
        <FlatUIColorsModal {...args} />
      </ModalWrapper>
    )
  }
}
