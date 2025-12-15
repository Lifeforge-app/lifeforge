import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@components/inputs'

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
        await new Promise(resolve => setTimeout(resolve, 2000))
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

export const WithConfirmationPrompt: Story = {
  args: {
    onClose: () => {},
    data: {
      title: 'Eliminate LifeForge from the Universe?',
      description:
        "Are you sure you want to revert to the time where LifeForge didn't exist? This will trigger a serious chaos in the universe and the consequences will be dire.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert(
          "Omg I can't believe you have the audacity to click this button lol"
        )
      },
      confirmationPrompt: 'Eliminate LifeForge',
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

/**
 * Story demonstrating the use of custom confirmation buttons in the ConfirmationModal.
 * This will replace the default confirmation button with a set of custom buttons provided by the user.
 * You can define any React nodes, not necessarily buttons, to be rendered in the modal.
 */
export const WithCustomConfirmationButtons: Story = {
  args: {
    onClose: () => {},
    data: {
      title: 'Are you sure?',
      description:
        'Are you sure you want to perform this cool action? This is an absolutely cool action that you probably want to do.',
      children: (
        <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
          <Button
            className="w-full"
            icon="tabler:question-mark"
            variant="secondary"
            onClick={() => {}}
          >
            Uhmmmmm...
          </Button>
          <Button
            className="w-full"
            icon="tabler:bubble"
            variant="secondary"
            onClick={() => alert('Rocket launched!')}
          >
            Let me think again
          </Button>
          <Button
            className="w-full"
            icon="tabler:arrow-left"
            variant="secondary"
            onClick={() => {}}
          >
            No, go back
          </Button>
          <Button
            className="w-full"
            icon="tabler:rocket"
            onClick={() => alert('Rocket launched!')}
          >
            Yes, launch the rocket
          </Button>
        </div>
      )
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
