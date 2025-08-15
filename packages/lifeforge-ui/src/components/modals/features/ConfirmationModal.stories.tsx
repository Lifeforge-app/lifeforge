import { Button } from '@components/buttons'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { useModalStore } from '../core/useModalStore'
import ConfirmationModal from './ConfirmationModal'

const meta = {
  component: ConfirmationModal
} satisfies Meta<typeof ConfirmationModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onClose: () => {},
    data: {
      title: 'Eliminate LifeForge from the Universe?',
      description:
        "Are you sure you want to revert to the time where LifeForge didn't exist? This will trigger a serious chaos in the universe and the consequences will be dire.",
      onConfirm: async () => {
        alert(
          "Omg I can't believe you have the audacity to click this button lol"
        )
      },
      confirmationButton: {
        icon: 'tabler:hammer-off',
        dangerous: true,
        children: 'Eliminate It'
      }
    }
  },
  render: args => {
    const open = useModalStore(state => state.open)

    return (
      <Button
        dangerous
        icon="tabler:trash"
        onClick={() => open(ConfirmationModal, args.data)}
      >
        Delete LifeForge
      </Button>
    )
  }
}
