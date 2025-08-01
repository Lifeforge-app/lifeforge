import { ModalWrapper } from '@components/modals'
import type { Meta, StoryObj } from '@storybook/react'

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
    return (
      <ModalWrapper isOpen={true}>
        <Index {...args} />
      </ModalWrapper>
    )
  }
}
