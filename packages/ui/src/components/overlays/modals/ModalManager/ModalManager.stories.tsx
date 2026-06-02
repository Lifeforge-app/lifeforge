import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/inputs'
import { Box, Flex, Text } from '@/components/primitives'
import { useModalStore } from '@/providers'

import { ModalManager } from './index'

const meta = {
  component: ModalManager,
  title: 'Overlays/ModalManager'
} satisfies Meta<typeof ModalManager>

export default meta

type Story = StoryObj<typeof meta>

// ─── Sample modals ────────────────────────────────────────────────────────────

function SimpleModal({
  data,
  onClose
}: {
  data: { title: string; body: string }
  onClose: () => void
}) {
  return (
    <Box minWidth="0" style={{ width: '28rem' }}>
      <Flex align="center" justify="between" mb="md">
        <Text size="xl" weight="semibold">
          {data.title}
        </Text>
        <Button icon="tabler:x" variant="plain" onClick={onClose} />
      </Flex>
      <Text style={{ color: 'var(--color-bg-500)' }}>{data.body}</Text>
      <Flex gap="sm" justify="end" mt="lg">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button icon="tabler:check" onClick={onClose}>
          Confirm
        </Button>
      </Flex>
    </Box>
  )
}

function NestedModal({
  data,
  onClose
}: {
  data: { depth: number }
  onClose: () => void
}) {
  const { open } = useModalStore()

  return (
    <Box minWidth="0" style={{ width: '24rem' }}>
      <Flex align="center" justify="between" mb="md">
        <Text size="xl" weight="semibold">
          Modal depth {data.depth}
        </Text>
        <Button icon="tabler:x" variant="plain" onClick={onClose} />
      </Flex>
      <Text style={{ color: 'var(--color-bg-500)' }}>
        This is level {data.depth} of the modal stack. You can open another
        modal on top.
      </Text>
      <Flex gap="sm" justify="end" mt="lg">
        <Button variant="secondary" onClick={onClose}>
          Close this
        </Button>
        <Button
          icon="tabler:stack-2"
          onClick={() => open(NestedModal, { depth: data.depth + 1 })}
        >
          Open deeper
        </Button>
      </Flex>
    </Box>
  )
}

function SlowModal({
  data: _data,
  onClose
}: {
  data: Record<string, never>
  onClose: () => void
}) {
  return (
    <Box minWidth="0" style={{ width: '26rem' }}>
      <Flex align="center" justify="between" mb="md">
        <Text size="xl" weight="semibold">
          Async Action
        </Text>
        <Button icon="tabler:x" variant="plain" onClick={onClose} />
      </Flex>
      <Text style={{ color: 'var(--color-bg-500)' }}>
        This modal simulates waiting for an async operation before closing.
      </Text>
      <Flex gap="sm" justify="end" mt="lg">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          icon="tabler:clock"
          onClick={async () => {
            await new Promise(res => setTimeout(res, 1500))
            onClose()
          }}
        >
          Wait 1.5s then close
        </Button>
      </Flex>
    </Box>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Open a single modal and close it via the button inside the modal or the
 * backdrop. Demonstrates the basic open → animate-in → close → animate-out
 * lifecycle managed by ModalManager.
 */
export const Default: Story = {
  render: () => {
    const { open } = useModalStore()

    return (
      <>
        <ModalManager />
        <Button
          icon="tabler:modal"
          onClick={() =>
            open(SimpleModal, {
              body: 'This modal is managed by the ModalManager component sitting in the same render tree.',
              title: 'Hello from ModalManager'
            })
          }
        >
          Open Modal
        </Button>
      </>
    )
  }
}

/**
 * Open the same modal multiple times in quick succession to verify ModalManager
 * keeps each instance independently on the stack and animates them in order.
 */
export const MultipleInstances: Story = {
  render: () => {
    const { open } = useModalStore()

    return (
      <>
        <ModalManager />
        <Flex gap="sm">
          <Button
            icon="tabler:modal"
            onClick={() =>
              open(SimpleModal, {
                body: 'This was opened first.',
                title: 'First Modal'
              })
            }
          >
            Open First
          </Button>
          <Button
            icon="tabler:modal"
            variant="secondary"
            onClick={() =>
              open(SimpleModal, {
                body: 'This was opened second - it sits on top of the first.',
                title: 'Second Modal'
              })
            }
          >
            Open Second
          </Button>
        </Flex>
      </>
    )
  }
}

/**
 * Each nested modal opens on top of the previous one. The modal below scales
 * to 95 % to signal depth. Close from the top to unwind the stack.
 */
export const NestedStack: Story = {
  render: () => {
    const { open } = useModalStore()

    return (
      <>
        <ModalManager />
        <Button
          icon="tabler:stack-2"
          onClick={() => open(NestedModal, { depth: 1 })}
        >
          Open nested modals
        </Button>
      </>
    )
  }
}

/**
 * Demonstrates the close animation: clicking "Wait 1.5s then close" sets
 * `isClosing = true` in the store, which triggers the fade/scale-out
 * transition before the entry is removed from the stack.
 */
export const CloseAnimation: Story = {
  render: () => {
    const { open } = useModalStore()

    return (
      <>
        <ModalManager />
        <Button icon="tabler:clock" onClick={() => open(SlowModal, {})}>
          Open slow-close modal
        </Button>
      </>
    )
  }
}
