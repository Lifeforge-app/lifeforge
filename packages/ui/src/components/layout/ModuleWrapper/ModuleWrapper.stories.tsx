import type { Meta, StoryObj } from '@storybook/react-vite'

import { ModuleHeader } from '@/components/layout'
import { Box, Flex, Grid, Text } from '@/components/primitives'

import { ModuleWrapper } from './index'

const meta = {
  argTypes: {
    children: { control: false }
  },
  component: ModuleWrapper
} satisfies Meta<typeof ModuleWrapper>

export default meta

type Story = StoryObj<typeof meta>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Box shadow bg={{ base: 'bg-50', dark: 'bg-900' }} p="lg" rounded="lg">
      <Text color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
        {label}
      </Text>
      <Text as="p" mt="xs" size="2xl" weight="bold">
        {value}
      </Text>
    </Box>
  )
}

function ContentCard({ body, title }: { title: string; body: string }) {
  return (
    <Box shadow bg={{ base: 'bg-50', dark: 'bg-900' }} p="lg" rounded="lg">
      <Text as="h3" mb="xs" size="lg" weight="semibold">
        {title}
      </Text>
      <Text color={{ base: 'bg-500', dark: 'bg-400' }} size="sm">
        {body}
      </Text>
    </Box>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * The default `ModuleWrapper` sets up the module header context, a scrollable
 * content area, and proper padding. Pair it with `ModuleHeader` as the first
 * child to render the icon, title, and description bar.
 */
export const Default: Story = {
  args: {
    children: <></>,
    config: {
      clearQueryOnUnmount: false,
      icon: 'tabler:cube',
      title: 'Demo Module'
    }
  },
  render: args => (
    <Box height="100vh" minHeight="100vh" width="100%">
      <ModuleWrapper {...args}>
        <ModuleHeader />

        <Grid
          templateCols="repeat(auto-fit, minmax(200px, 1fr))"
          gap="md"
          mb="xl"
          width="100%"
        >
          <StatCard label="Total Items" value="1,284" />
          <StatCard label="Active" value="847" />
          <StatCard label="Completed" value="437" />
        </Grid>

        <Flex direction="column" gap="md" width="100%">
          <ContentCard
            body="Here is a brief summary of the first item in your module. It contains useful information."
            title="First Entry"
          />
          <ContentCard
            body="This is the second entry in the list. Use this area to display relevant module data."
            title="Second Entry"
          />
          <ContentCard
            body="A third entry demonstrating how the module content area scrolls naturally."
            title="Third Entry"
          />
          <ContentCard
            body="Another entry to show padding and spacing consistency across the module body."
            title="Fourth Entry"
          />
        </Flex>
      </ModuleWrapper>
    </Box>
  )
}
