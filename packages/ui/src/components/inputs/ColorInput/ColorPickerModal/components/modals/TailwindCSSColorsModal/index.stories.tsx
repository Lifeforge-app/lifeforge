import type { Meta, StoryObj } from '@storybook/react-vite'

import { ModalWrapper } from '@/components/overlays'

import { TailwindCSSColorsModal } from './index'

const meta = {
  component: TailwindCSSColorsModal
} satisfies Meta<typeof TailwindCSSColorsModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: { color: 'color', setColor: () => {} },
    onClose: () => {}
  },
  render: args => {
    return (
      <ModalWrapper isOpen={true}>
        <TailwindCSSColorsModal {...args} />
      </ModalWrapper>
    )
  }
}
