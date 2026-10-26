import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button, SearchInput } from '@/components/inputs'
import { Card } from '@/components/layout'
import { ContextMenu } from '@/components/overlays'
import { Box, Flex, Grid, Icon, Stack, Text } from '@/components/primitives'
import { colorWithOpacity } from '@/system'

import { createViewMode } from './index'

const ITEMS = [
  'Clean Code',
  'The Pragmatic Programmer',
  'Refactoring',
  'Designing Data-Intensive Applications',
  'The Mythical Man-Month',
  'Working Effectively with Legacy Code'
] as const

/**
 * Mirrors the Railway Map / Books Library setup: icon-only modes, the inline
 * selector hidden on small screens, and a context-menu selector for mobile.
 */
const ListGridMode = createViewMode({
  modes: [
    { icon: 'tabler:list', value: 'list' },
    { icon: 'uil:apps', value: 'grid' }
  ],
  persistInLocalStorage: false,
  selectorProps: {
    display: { base: 'none', md: 'flex' }
  },
  useNuqs: false
})

/**
 * Mirrors Modrinth, which exposes three view modes.
 */
const MultiMode = createViewMode({
  modes: [
    { icon: 'tabler:list', value: 'list' },
    { icon: 'uil:apps', value: 'grid' },
    { icon: 'tabler:photo', value: 'gallery' }
  ],
  persistInLocalStorage: false,
  selectorProps: {
    display: { base: 'none', md: 'flex' }
  },
  useNuqs: false
})

/**
 * Mirrors the sudoku module: the selected mode is owned by the page and
 * persisted neither in the URL nor in localStorage.
 */
const InputMode = createViewMode({
  defaultValue: 'normal',
  modes: [
    { icon: 'tabler:pencil', text: 'Normal', value: 'normal' },
    { icon: 'tabler:notes', text: 'Candidate', value: 'candidate' }
  ],
  persistInLocalStorage: false,
  useNuqs: false
})

function ListItem({ label }: { label: string }) {
  return (
    <Card isInteractive align="center" direction="row" gap="sm">
      <Icon color="primary" icon="tabler:book" />
      <Text truncate>{label}</Text>
    </Card>
  )
}

function GridItem({ label }: { label: string }) {
  return (
    <Card isInteractive gap="sm">
      <Flex
        align="center"
        aspectRatio="16 / 9"
        bg={colorWithOpacity('custom-500', '20%')}
        justify="center"
        r="md"
      >
        <Icon color="primary" icon="tabler:book" size="2em" />
      </Flex>
      <Text truncate weight="medium">
        {label}
      </Text>
      <Text color="muted" size="sm">
        Book
      </Text>
    </Card>
  )
}

function GalleryItem({ label }: { label: string }) {
  return (
    <Card isInteractive gap="sm" p="sm">
      <Flex
        align="center"
        bg={colorWithOpacity('custom-500', '30%')}
        height="100%"
        justify="center"
        minHeight="16rem"
        r="md"
        width="100%"
      >
        <Icon color="primary" icon="tabler:photo" size="3em" />
      </Flex>
      <Text truncate align="center" weight="medium">
        {label}
      </Text>
    </Card>
  )
}

function ListGridDemo() {
  const [query, setQuery] = useState('')

  const filtered = ITEMS.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <ListGridMode.Root>
      <Box width="100%">
        <Flex align="center" gap="md" mb="lg" width="100%">
          <Box flex="1" minWidth="0">
            <SearchInput
              searchTarget="book"
              value={query}
              onChange={setQuery}
            />
          </Box>
          <Box display={{ base: 'block', md: 'none' }}>
            <ContextMenu>
              <ListGridMode.ContextMenuSelector />
            </ContextMenu>
          </Box>
          <ListGridMode.Selector />
        </Flex>
        <ListGridMode.When mode="list">
          <Flex direction="column" gap="sm">
            {filtered.map(item => (
              <ListItem key={item} label={item} />
            ))}
          </Flex>
        </ListGridMode.When>
        <ListGridMode.When mode="grid">
          <Grid gap="sm" templateCols={{ base: 1, md: 3, sm: 2 }}>
            {filtered.map(item => (
              <GridItem key={item} label={item} />
            ))}
          </Grid>
        </ListGridMode.When>
      </Box>
    </ListGridMode.Root>
  )
}

function ThreeModesDemo() {
  return (
    <MultiMode.Root>
      <Box width="100%">
        <Flex align="center" justify="between" mb="lg">
          <Text size="lg" weight="semibold">
            Library
          </Text>
          <Flex align="center" gap="md">
            <Box display={{ base: 'block', md: 'none' }}>
              <ContextMenu>
                <MultiMode.ContextMenuSelector />
              </ContextMenu>
            </Box>
            <MultiMode.Selector />
          </Flex>
        </Flex>
        <MultiMode.When mode="list">
          <Flex direction="column" gap="sm">
            {ITEMS.map(item => (
              <ListItem key={item} label={item} />
            ))}
          </Flex>
        </MultiMode.When>
        <MultiMode.When mode="grid">
          <Grid gap="sm" templateCols={{ base: 1, md: 3, sm: 2 }}>
            {ITEMS.map(item => (
              <GridItem key={item} label={item} />
            ))}
          </Grid>
        </MultiMode.When>
        <MultiMode.When mode="gallery">
          <Grid gap="sm" templateCols={{ base: 1, lg: 4, md: 3, sm: 2 }}>
            {ITEMS.map(item => (
              <GalleryItem key={item} label={item} />
            ))}
          </Grid>
        </MultiMode.When>
      </Box>
    </MultiMode.Root>
  )
}

function ControlledModeDemo() {
  const [mode, setMode] = useState<'normal' | 'candidate'>('normal')

  return (
    <InputMode.Root currentMode={mode} onModeChange={setMode}>
      <Stack gap="md" width="100%">
        <Flex align="center" gap="md" justify="between" wrap="wrap">
          <InputMode.Selector />
          <Button
            icon="tabler:repeat"
            variant="secondary"
            onClick={() => {
              setMode(mode === 'normal' ? 'candidate' : 'normal')
            }}
          >
            Toggle externally
          </Button>
        </Flex>
        <InputMode.When mode="normal">
          <Grid gap="sm" templateCols={3}>
            {Array.from({ length: 9 }, (_, index) => (
              <Card key={index} centered>
                <Text size="xl" weight="medium">
                  {index + 1}
                </Text>
              </Card>
            ))}
          </Grid>
        </InputMode.When>
        <InputMode.When mode="candidate">
          <Text color="muted">
            Candidate mode is controlled by the page, just like the sudoku
            toolbar.
          </Text>
        </InputMode.When>
      </Stack>
    </InputMode.Root>
  )
}

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          '`createViewMode` builds a small store and a set of components (`Root`, `Selector`, `ContextMenuSelector`, `When`) for switching between list/grid/gallery layouts. Modules normally use its defaults (URL sync and localStorage persistence); the stories disable both so every story starts from a clean state.'
      }
    }
  },
  title: 'Layout/WithViewMode'
} satisfies Meta

export default meta

type Story = StoryObj

/**
 * Mirrors the Railway Map and Books Library header: a search field next to the
 * inline selector on desktop, with the selector moved into a context menu on
 * small screens.
 */
export const InHeaderToolbar: Story = {
  render: () => <ListGridDemo />
}

/**
 * Mirrors Modrinth's three-mode layout (list, grid and gallery) with the same
 * responsive selector pattern.
 */
export const ThreeModes: Story = {
  render: () => <ThreeModesDemo />
}

/**
 * Mirrors the sudoku toolbar: the mode is controlled externally via
 * `currentMode` / `onModeChange`, without URL or localStorage persistence.
 */
export const ControlledMode: Story = {
  render: () => <ControlledModeDemo />
}
