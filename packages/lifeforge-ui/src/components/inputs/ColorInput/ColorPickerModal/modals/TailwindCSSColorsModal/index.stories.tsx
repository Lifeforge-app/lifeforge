import type { Meta, StoryObj } from '@storybook/react'

import { ModalWrapper } from '@components/modals'

import Index from './index'

const meta = {
  component: Index
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClose: () => {},
    data: { color: 'color', setColor: () => {} }
  },
  render: args => {
    return (
      <ModalWrapper isOpen={true}>
        <Index {...args} />
      </ModalWrapper>
    )
  }
}
