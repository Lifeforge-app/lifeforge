import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/components/inputs'
import { ModuleWrapper } from '@/components/layout'
import { ContextMenu, ContextMenuItem } from '@/components/overlays'
import { Box } from '@/components/primitives'

import { ModuleHeader } from './index'

const meta = {
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    trailing: { control: false }
  },
  component: ModuleHeader,
  title: 'Layout/ModuleHeader'
} satisfies Meta<typeof ModuleHeader>

export default meta

type Story = StoryObj<typeof meta>

// ─── Wrapper ──────────────────────────────────────────────────────────────────

/**
 * Every story must be nested inside ModuleWrapper so that
 * ModuleMetadataProvider is available for the title/icon context.
 */
function StoryShell({ children }: { children: React.ReactNode }) {
  return (
    <Box height="20vh" minHeight="20vh" width="100%">
      <ModuleWrapper
        config={{
          clearQueryOnUnmount: false,
          icon: 'tabler:cube',
          name: '',
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
 * `actionButton` renders arbitrary React content in the right-hand action
 * area. The most common usage is a primary create/add button.
 */
export const WithActionButton: Story = {
  args: {
    trailing: (
      <Button icon="tabler:plus" onClick={() => {}}>
        New Item
      </Button>
    )
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}

/**
 * `trailing` can also be a `ContextMenu` component that mount a three-dot
 * overflow menu in the action area. Pass `ContextMenuItem` elements as
 * children for the menu options.
 */
export const WithContextMenu: Story = {
  args: {
    trailing: (
      <ContextMenu>
        <ContextMenuItem icon="tabler:pencil" label="Edit" onClick={() => {}} />
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
      </ContextMenu>
    )
  },
  render: args => (
    <StoryShell>
      <ModuleHeader {...args} />
    </StoryShell>
  )
}
