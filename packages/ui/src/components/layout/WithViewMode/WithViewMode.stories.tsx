/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenu } from '@/components/overlays'
import { Box, Flex, Grid, Text } from '@/components/primitives'

import { WithViewMode } from './index'

const meta = {
  argTypes: {
    children: {
      control: false
    },
    contextMenuSelectorProps: {
      control: false
    },
    modes: {
      control: false
    },
    selectorProps: {
      control: false
    }
  },
  component: WithViewMode,
  title: 'Layout/WithViewMode'
} satisfies Meta<typeof WithViewMode>

export default meta

type Story = StoryObj<typeof meta>

const VIEW_MODES = [
  { icon: 'tabler:list', text: 'List', value: 'list' },
  { icon: 'tabler:grid-dots', text: 'Grid', value: 'grid' }
] as const

function DemoItem({ label }: { label: string }) {
  return (
    <Box
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--br-md)',
        padding: '16px'
      }}
    >
      <Text>{label}</Text>
    </Box>
  )
}

const ITEMS = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']

/**
 * Basic list and grid view switching. Use the selector to toggle between views.
 */
export const Default: Story = {
  args: {
    children: () => <></>,
    modes: VIEW_MODES
  },
  render: args => (
    <WithViewMode {...(args as any)} modes={VIEW_MODES}>
      {({ currentMode, View, ViewModeSelector }) => (
        <Box style={{ width: '100%' }}>
          <Flex align="center" gap="md" justify="between" mb="md">
            <ViewModeSelector />
            <Text color="muted" size="sm">
              Current: {currentMode}
            </Text>
          </Flex>
          <View mode="list">
            <Flex direction="column" gap="sm">
              {ITEMS.map(item => (
                <DemoItem key={item} label={item} />
              ))}
            </Flex>
          </View>
          <View mode="grid">
            <Grid gap="sm" templateCols={3}>
              {ITEMS.map(item => (
                <DemoItem key={item} label={item} />
              ))}
            </Grid>
          </View>
        </Box>
      )}
    </WithViewMode>
  )
}

const ICON_ONLY_MODES = [
  { icon: 'tabler:list', value: 'list' },
  { icon: 'tabler:grid-dots', value: 'grid' },
  { icon: 'tabler:layout-grid', value: 'gallery' }
] as const

/**
 * Using icon-only modes. No text labels on the selector buttons.
 */
export const IconOnlyModes: Story = {
  args: {
    children: () => <></>,
    modes: ICON_ONLY_MODES
  },
  render: args => (
    <WithViewMode {...(args as any)} modes={ICON_ONLY_MODES}>
      {({ View, ViewModeSelector }) => (
        <Box style={{ width: '100%' }}>
          <Box style={{ marginBottom: '16px' }}>
            <ViewModeSelector />
          </Box>
          <View mode="list">
            <Flex direction="column" gap="sm">
              {ITEMS.map(item => (
                <DemoItem key={item} label={`List: ${item}`} />
              ))}
            </Flex>
          </View>
          <View mode="grid">
            <Grid gap="sm" templateCols={2}>
              {ITEMS.map(item => (
                <DemoItem key={item} label={`Grid: ${item}`} />
              ))}
            </Grid>
          </View>
          <View mode="gallery">
            <Grid gap="sm" templateCols={3}>
              {ITEMS.map(item => (
                <DemoItem key={item} label={`Gallery: ${item}`} />
              ))}
            </Grid>
          </View>
        </Box>
      )}
    </WithViewMode>
  )
}

const MINIMAL_MODES = [
  { text: 'Compact', value: 'compact' },
  { text: 'Comfortable', value: 'comfortable' }
] as const

/**
 * Using text-only modes for a density-style toggle. Useful for controlling spacing or layout density.
 */
export const TextOnlyModes: Story = {
  args: {
    children: () => <></>,
    modes: MINIMAL_MODES
  },
  render: args => (
    <WithViewMode {...(args as any)} modes={MINIMAL_MODES}>
      {({ View, ViewModeSelector }) => (
        <Box style={{ width: '100%' }}>
          <Box style={{ marginBottom: '16px' }}>
            <ViewModeSelector />
          </Box>
          <View mode="compact">
            <Flex direction="column" gap="xs">
              {ITEMS.map(item => (
                <Box
                  key={item}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--br-sm)',
                    padding: '8px 12px'
                  }}
                >
                  <Text size="sm">{item}</Text>
                </Box>
              ))}
            </Flex>
          </View>
          <View mode="comfortable">
            <Flex direction="column" gap="md">
              {ITEMS.map(item => (
                <Box
                  key={item}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--br-md)',
                    padding: '20px 24px'
                  }}
                >
                  <Text>{item}</Text>
                </Box>
              ))}
            </Flex>
          </View>
        </Box>
      )}
    </WithViewMode>
  )
}

/**
 * Using the context menu variant of the selector. Useful for compact layouts
 * where the button-based selector takes too much space, like inside a header toolbar.
 */
export const WithContextMenuSelector: Story = {
  args: {
    children: () => <></>,
    modes: VIEW_MODES
  },
  render: args => (
    <WithViewMode {...(args as any)} modes={VIEW_MODES}>
      {({ View, ViewModeContextMenuSelector }) => (
        <Box style={{ width: '100%' }}>
          <Flex align="center" gap="md" justify="end" mb="md">
            <ContextMenu>
              <ViewModeContextMenuSelector />
            </ContextMenu>
          </Flex>
          <View mode="list">
            <Flex direction="column" gap="sm">
              {ITEMS.map(item => (
                <DemoItem key={item} label={item} />
              ))}
            </Flex>
          </View>
          <View mode="grid">
            <Grid gap="sm" templateCols={3}>
              {ITEMS.map(item => (
                <DemoItem key={item} label={item} />
              ))}
            </Grid>
          </View>
        </Box>
      )}
    </WithViewMode>
  )
}
