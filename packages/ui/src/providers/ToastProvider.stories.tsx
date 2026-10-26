import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/inputs'
import { Box, Flex, Icon, Text } from '@/components/primitives'

import { toast } from './ToastProvider'

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          'Toast notifications are triggered imperatively through the `toast` helper exported by `ToastProvider`. The provider renders the toast container and is already mounted by the app root.'
      }
    }
  },
  title: 'Feedback/Toast'
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * Toasts come in four semantic variants: success, error, warning, and info.
 * Each toast is automatically dismissed after 3 seconds by default.
 */
export const Variants: Story = {
  render: () => (
    <Flex align="center" gap="md" wrap="wrap">
      <Button
        icon="tabler:circle-check"
        onClick={() => {
          toast.success('Changes saved successfully.')
        }}
      >
        Success
      </Button>
      <Button
        dangerous
        icon="tabler:alert-circle"
        onClick={() => {
          toast.error('Failed to save changes.')
        }}
      >
        Error
      </Button>
      <Button
        bg="amber-500"
        icon="tabler:alert-triangle"
        onClick={() => {
          toast.warning('Your session will expire in 5 minutes.')
        }}
      >
        Warning
      </Button>
      <Button
        bg="blue-500"
        icon="tabler:info-circle"
        onClick={() => {
          toast.info('A new version is available.')
        }}
      >
        Info
      </Button>
    </Flex>
  )
}

/**
 * A toast can render arbitrary content when a plain message is not enough.
 * Use a custom toast for richer notifications with a title, description, or icon.
 */
export const CustomContent: Story = {
  render: () => (
    <Button
      icon="tabler:rocket"
      onClick={() => {
        toast(
          <Flex align="start" gap="md">
            <Icon color="primary" icon="tabler:rocket" size="1.5em" />
            <Box>
              <Text weight="semibold">Deployment started</Text>
              <Text color="muted" size="sm">
                Your app will be live in a few minutes.
              </Text>
            </Box>
          </Flex>
        )
      }}
    >
      Show custom toast
    </Button>
  )
}

/**
 * A loading toast can be updated in place once the underlying task finishes,
 * so the user does not need to wait for a new toast to appear.
 */
export const LoadingThenSuccess: Story = {
  render: () => (
    <Button
      icon="tabler:upload"
      onClick={() => {
        const toastId = toast.loading('Uploading file...')

        setTimeout(() => {
          toast.update(toastId, {
            autoClose: 3000,
            isLoading: false,
            render: 'File uploaded successfully.',
            type: 'success'
          })
        }, 2000)
      }}
    >
      Upload file
    </Button>
  )
}

/**
 * `toast.promise` automatically transitions a single toast through its pending,
 * success, and error states as the promise settles.
 */
export const PromiseLifecycle: Story = {
  name: 'Promise',
  render: () => (
    <Flex align="center" gap="md" wrap="wrap">
      <Button
        icon="tabler:circle-check"
        onClick={() => {
          void toast.promise(wait(2000), {
            error: 'Failed to save changes.',
            pending: 'Saving changes...',
            success: 'Changes saved successfully.'
          })
        }}
      >
        Resolving promise
      </Button>
      <Button
        dangerous
        icon="tabler:circle-x"
        onClick={() => {
          void toast.promise(
            wait(2000).then(() => {
              throw new Error('Save failed')
            }),
            {
              error: 'Failed to save changes.',
              pending: 'Saving changes...',
              success: 'Changes saved successfully.'
            }
          )
        }}
      >
        Rejecting promise
      </Button>
    </Flex>
  )
}
