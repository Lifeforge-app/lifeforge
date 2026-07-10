import type { Meta, StoryObj } from '@storybook/react-vite'

import { ContextMenu } from '@/components/overlays'
import { Box, Flex, Grid, Text } from '@/components/primitives'

import { createViewMode } from './index'

const VIEW_MODES = [
  { icon: 'tabler:list', text: 'List', value: 'list' },
  { icon: 'tabler:grid-dots', text: 'Grid', value: 'grid' }
] as const

const ICON_ONLY_MODES = [
  { icon: 'tabler:list', value: 'list' },
  { icon: 'tabler:grid-dots', value: 'grid' },
  { icon: 'tabler:layout-grid', value: 'gallery' }
] as const

const MINIMAL_MODES = [
  { text: 'Compact', value: 'compact' },
  { text: 'Comfortable', value: 'comfortable' }
] as const

const ITEMS = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']

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

const meta = {
  title: 'Layout/WithViewMode'
} satisfies Meta

export default meta

type Story = StoryObj

const ListGridViewMode = createViewMode({ modes: VIEW_MODES })
const IconOnlyViewMode = createViewMode({ modes: ICON_ONLY_MODES })
const DensityViewMode = createViewMode({ modes: MINIMAL_MODES })

function CurrentModeLabel() {
  const { currentMode } = ListGridViewMode.useContext()

  return (
    <Text color="muted" size="sm">
      Current: {currentMode}
    </Text>
  )
}

/**
 * Basic list and grid view switching. Use the selector to toggle between views.
 */
export const Default: Story = {
  render: () => (
    <ListGridViewMode.Root>
      <Box style={{ width: '100%' }}>
        <Flex align="center" gap="md" justify="between" mb="md">
          <ListGridViewMode.Selector />
          <CurrentModeLabel />
        </Flex>
        <ListGridViewMode.When mode="list">
          <Flex direction="column" gap="sm">
            {ITEMS.map(item => (
              <DemoItem key={item} label={item} />
            ))}
          </Flex>
        </ListGridViewMode.When>
        <ListGridViewMode.When mode="grid">
          <Grid gap="sm" templateCols={3}>
            {ITEMS.map(item => (
              <DemoItem key={item} label={item} />
            ))}
          </Grid>
        </ListGridViewMode.When>
      </Box>
    </ListGridViewMode.Root>
  )
}

/**
 * Using icon-only modes. No text labels on the selector buttons.
 */
export const IconOnlyModes: Story = {
  render: () => (
    <IconOnlyViewMode.Root>
      <Box style={{ width: '100%' }}>
        <Box style={{ marginBottom: '16px' }}>
          <IconOnlyViewMode.Selector />
        </Box>
        <IconOnlyViewMode.When mode="list">
          <Flex direction="column" gap="sm">
            {ITEMS.map(item => (
              <DemoItem key={item} label={`List: ${item}`} />
            ))}
          </Flex>
        </IconOnlyViewMode.When>
        <IconOnlyViewMode.When mode="grid">
          <Grid gap="sm" templateCols={2}>
            {ITEMS.map(item => (
              <DemoItem key={item} label={`Grid: ${item}`} />
            ))}
          </Grid>
        </IconOnlyViewMode.When>
        <IconOnlyViewMode.When mode="gallery">
          <Grid gap="sm" templateCols={3}>
            {ITEMS.map(item => (
              <DemoItem key={item} label={`Gallery: ${item}`} />
            ))}
          </Grid>
        </IconOnlyViewMode.When>
      </Box>
    </IconOnlyViewMode.Root>
  )
}

/**
 * Using text-only modes for a density-style toggle. Useful for controlling spacing or layout density.
 */
export const TextOnlyModes: Story = {
  render: () => (
    <DensityViewMode.Root>
      <Box style={{ width: '100%' }}>
        <Box style={{ marginBottom: '16px' }}>
          <DensityViewMode.Selector />
        </Box>
        <DensityViewMode.When mode="compact">
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
        </DensityViewMode.When>
        <DensityViewMode.When mode="comfortable">
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
        </DensityViewMode.When>
      </Box>
    </DensityViewMode.Root>
  )
}

/**
 * Using the context menu variant of the selector. Useful for compact layouts
 * where the button-based selector takes too much space, like inside a header toolbar.
 */
export const WithContextMenuSelector: Story = {
  render: () => (
    <ListGridViewMode.Root>
      <Box style={{ width: '100%' }}>
        <Flex align="center" gap="md" justify="end" mb="md">
          <ContextMenu>
            <ListGridViewMode.ContextMenuSelector />
          </ContextMenu>
        </Flex>
        <ListGridViewMode.When mode="list">
          <Flex direction="column" gap="sm">
            {ITEMS.map(item => (
              <DemoItem key={item} label={item} />
            ))}
          </Flex>
        </ListGridViewMode.When>
        <ListGridViewMode.When mode="grid">
          <Grid gap="sm" templateCols={3}>
            {ITEMS.map(item => (
              <DemoItem key={item} label={item} />
            ))}
          </Grid>
        </ListGridViewMode.When>
      </Box>
    </ListGridViewMode.Root>
  )
}
