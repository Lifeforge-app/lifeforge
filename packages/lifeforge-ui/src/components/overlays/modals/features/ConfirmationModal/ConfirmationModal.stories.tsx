import type { Meta, StoryObj } from '@storybook/react-vite'
import { useModalStore } from 'shared'

import { Button } from '@components/inputs'
import { Grid } from '@components/primitives'

import { ConfirmationModal } from './index'

const meta = {
  component: ConfirmationModal
} satisfies Meta<typeof ConfirmationModal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    data: {
      confirmationButton: {
        children: 'Eliminate It',
        dangerous: true,
        icon: 'tabler:hammer-off'
      },
      description:
        "Are you sure you want to revert to the time where LifeForge didn't exist? This will trigger a serious chaos in the universe and the consequences will be dire.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert(
          "Omg I can't believe you have the audacity to click this button lol"
        )
      },
      title: 'Eliminate LifeForge from the Universe?'
    },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

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
    data: {
      confirmationButton: {
        children: 'Eliminate It',
        dangerous: true,
        icon: 'tabler:hammer-off'
      },
      confirmationPrompt: 'Eliminate LifeForge',
      description:
        "Are you sure you want to revert to the time where LifeForge didn't exist? This will trigger a serious chaos in the universe and the consequences will be dire.",
      onConfirm: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert(
          "Omg I can't believe you have the audacity to click this button lol"
        )
      },
      title: 'Eliminate LifeForge from the Universe?'
    },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

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
    data: {
      description:
        'Are you sure you want to perform this cool action? This is an absolutely cool action that you probably want to do.',
      renderChildren: onClose => (
        <Grid
          columns={{
            base: 1,
            sm: 2
          }}
          gap="sm"
          mt="lg"
          width="100%"
        >
          <Button
            icon="tabler:question-mark"
            variant="secondary"
            width="100%"
            onClick={() => {
              alert('Let me think again...')
            }}
          >
            Uhmmmmm...
          </Button>
          <Button
            icon="tabler:bubble"
            variant="secondary"
            width="100%"
            onClick={() => alert('Hmmmmmmm.....')}
          >
            Let me think again
          </Button>
          <Button
            icon="tabler:arrow-left"
            variant="secondary"
            width="100%"
            onClick={onClose}
          >
            No, go back
          </Button>
          <Button
            icon="tabler:rocket"
            width="100%"
            onClick={() => alert('Rocket launched!')}
          >
            Yes, launch the rocket
          </Button>
        </Grid>
      ),
      title: 'Are you sure?'
    },
    onClose: () => {}
  },
  render: args => {
    const { open } = useModalStore()

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
