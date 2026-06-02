import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/inputs'
import { ModuleWrapper } from '@/components/layout'
import { ContextMenuItem } from '@/components/overlays'
import { Box, Flex, Text } from '@/components/primitives'

import { ModuleHeader } from './index'

const meta = {
  argTypes: {
    actionButton: { control: false },
    contextMenuProps: { control: false },
    customElement: { control: false },
    icon: { control: 'text' },
    tips: { control: false },
    title: { control: 'text' },
    totalItems: { control: 'number' }
  },
  component: ModuleHeader,
  title: 'Layout/ModuleHeader'
} satisfies Meta<typeof ModuleHeader>

export default meta

type Story = StoryObj<typeof meta>

// ─── Wrapper ──────────────────────────────────────────────────────────────────

/**
 * Every story must be nested inside ModuleWrapper so that
 * ModuleHeaderStateProvider is available for the title/icon context.
 */
function StoryShell({ children }: { children: React.ReactNode }) {
  return (
    <Box height="20vh" minHeight="20vh" width="100%">
      <ModuleWrapper
        config={{
          clearQueryOnUnmount: false,
          icon: 'tabler:cube',
          title: 'Demo Module'
        }}
      >
        {children}
      </ModuleWrapper>
    </Box>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * With no props, `ModuleHeader` reads `title` and `icon` from the nearest
 * `ModuleWrapper` context - the typical usage inside a module page.
 */
export const Default: Story = {
  args: {},
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * Pass `title` and `icon` directly to override the context values. Useful
 * when rendering the header outside of a `ModuleWrapper`, or when a sub-page
 * needs a different title.
 */
export const ExplicitTitleAndIcon: Story = {
  args: {
    icon: 'tabler:wallet',
    title: 'Wallet'
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * `totalItems` appends a muted item count next to the title - commonly used
 * in list modules to show the total number of records at a glance.
 */
export const WithTotalItems: Story = {
  args: {
    totalItems: 1284
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * `actionButton` renders arbitrary React content in the right-hand action
 * area. The most common usage is a primary create/add button.
 */
export const WithActionButton: Story = {
  args: {
    actionButton: (
      <Button icon="tabler:plus" onClick={() => {}}>
        New Item
      </Button>
    ),
    totalItems: 24
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * `customElement` places arbitrary content after the action button - useful
 * for secondary controls such as view-toggle buttons or filter chips.
 */
export const WithCustomElement: Story = {
  args: {
    customElement: (
      <Flex gap="xs">
        <Button icon="tabler:layout-grid" variant="plain" onClick={() => {}} />
        <Button icon="tabler:layout-list" variant="plain" onClick={() => {}} />
      </Flex>
    )
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * A plain string passed to `tips` renders a question-mark button that opens
 * a "Tips & Tricks" panel. Hover the `?` icon to reveal it (visible on `md+`).
 */
export const WithTipsString: Story = {
  args: {
    tips: 'Use keyboard shortcuts Ctrl+N to create a new item, and Ctrl+F to search through your entries quickly.'
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * Passing an object `{ title, content }` to `tips` lets you use a custom panel
 * title and rich React content instead of a plain string.
 */
export const WithTipsObject: Story = {
  args: {
    tips: {
      content: (
        <Flex direction="column" gap="sm">
          <Text as="p">
            Create your first entry using the{' '}
            <Text as="code" weight="semibold">
              + New Item
            </Text>{' '}
            button.
          </Text>
          <Text as="p">
            Filter and search results using the toolbar controls at the top of
            the list.
          </Text>
          <Text as="p">
            Drag rows to reorder, or use the context menu for bulk actions.
          </Text>
        </Flex>
      ),
      title: 'Getting started'
    }
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * `contextMenuProps` mounts a three-dot overflow `ContextMenu` in the action
 * area. Pass `children` with `ContextMenuItem` elements for the menu options.
 */
export const WithContextMenu: Story = {
  args: {
    contextMenuProps: {
      children: (
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() => {}}
          />
          <ContextMenuItem
            icon="tabler:download"
            label="Export"
            onClick={() => {}}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {}}
          />
        </>
      )
    }
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * All optional slots filled at once - a representative "kitchen sink" view
 * showing how every prop composes together.
 */
export const FullyLoaded: Story = {
  args: {
    actionButton: (
      <Button icon="tabler:plus" onClick={() => {}}>
        New Item
      </Button>
    ),
    contextMenuProps: {
      children: (
        <>
          <ContextMenuItem
            icon="tabler:download"
            label="Export all"
            onClick={() => {}}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete all"
            onClick={() => {}}
          />
        </>
      )
    },
    customElement: (
      <Flex gap="xs">
        <Button icon="tabler:layout-grid" variant="plain" onClick={() => {}} />
        <Button icon="tabler:layout-list" variant="plain" onClick={() => {}} />
      </Flex>
    ),
    tips: {
      content: (
        <Text as="p">
          Use the action button to create new entries. Switch views with the
          grid and list toggles.
        </Text>
      ),
      title: 'Getting started'
    },
    totalItems: 842
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}
