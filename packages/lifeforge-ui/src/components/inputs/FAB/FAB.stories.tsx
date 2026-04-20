import type { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenu, ContextMenuItem } from '@components/overlays'
import { Box, Flex, Text } from '@components/primitives'

import Fab from './FAB'

const meta = {
  component: Fab
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
        <ContextMenu
          buttonComponent={<Fab {...props} style={{ position: 'static' }} />}
          side="top"
          styles={{
            wrapper: {
              width: 'min-content',
              position: 'fixed',
              right: '1.5em',
              bottom: '1.5em'
            }
          }}
        >
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
        </ContextMenu>
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
      <Text as="p" color="bg-500" size="lg">
        Resize the viewport to see the FAB hide at the &apos;md&apos; breakpoint
        and below.
      </Text>
      <Fab {...props} />
    </Flex>
  )
}
