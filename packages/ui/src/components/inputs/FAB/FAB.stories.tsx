import type { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenuItem } from '@/components/overlays'
import { Box, Flex, Text } from '@/components/primitives'

import { FAB as Fab } from './index'

const meta = {
  component: Fab,
  title: 'Inputs/FAB'
} satisfies Meta<typeof Fab>

export default meta

type Story = StoryObj<typeof meta>

/**
 * A floating action button (FAB) component for primary actions.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:plus',
    visibilityBreakpoint: false
  },
  render: props => (
    <Box style={{ height: '12rem' }}>
      <Fab {...props} />
    </Box>
  )
}

/**
 * A floating action button (FAB) component, integrated with a context menu for additional actions.
 */
export const WithContextMenu: Story = {
  args: {
    icon: 'tabler:plus',
    visibilityBreakpoint: false
  },
  render: props => {
    return (
      <Box style={{ height: '12rem' }}>
        <Fab {...props}>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() => {}}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {}}
          />
        </Fab>
      </Box>
    )
  }
}

export const WithVisibilityBreakpoint: Story = {
  args: {
    icon: 'tabler:plus',
    visibilityBreakpoint: 'md'
  },
  render: props => (
    <Flex
      align="center"
      height="100%"
      justify="center"
      position="relative"
      width="100%"
    >
      <Text as="p" color="muted" size="lg">
        Resize the viewport to see the FAB hide at the &apos;md&apos; breakpoint
        and below.
      </Text>
      <Fab {...props} />
    </Flex>
  )
}
