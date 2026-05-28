import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button, Listbox, ListboxOption } from '@components/inputs'
import { Box, Grid, Text } from '@components/primitives'

import { ScrollableStory } from '@/storybook/ScrollableStory'

import { Widget } from './index'
import { TAILWIND_PALETTE } from '@/system'

const meta = {
  component: Widget
} satisfies Meta<typeof Widget>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Displaying multiple Widget components in a grid layout.
 */
export const Default: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'Cool Widget'
  },
  render: args => (
    <Grid columns={3} gap="lg" rows={3}>
      <Widget {...args}>
        <Text as="p" color="bg-600">
          This is a dashboard item.
        </Text>
      </Widget>
      <Box gridColumnSpan={2} gridRowSpan={2}>
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a larger dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridRowSpan={2}>
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a tall dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridColumnSpan={2}>
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a wide dashboard item.
          </Text>
        </Widget>
      </Box>
    </Grid>
  )
}

export const WithDescription: Story = {
  args: {
    description: 'Cool Widget Description',
    icon: 'tabler:cube',
    title: 'Cool Widget'
  },
  render: args => (
    <Grid columns={3} gap="lg" rows={3}>
      <Widget {...args}>
        <Text as="p" color="bg-600">
          This is a dashboard item.
        </Text>
      </Widget>
      <Box gridColumnSpan={2} gridRowSpan={2}>
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a larger dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridRowSpan={2}>
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a tall dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridColumnSpan={2}>
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a wide dashboard item.
          </Text>
        </Widget>
      </Box>
    </Grid>
  )
}

export const WithIconColor: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'A Cool Widget'
  },
  render: args => (
    <ScrollableStory>
      <Grid columns={3} gap="md">
        {[TAILWIND_PALETTE.red[500], TAILWIND_PALETTE.blue[500], TAILWIND_PALETTE.green[500], TAILWIND_PALETTE.yellow[500], TAILWIND_PALETTE.purple[500], TAILWIND_PALETTE.pink[500], TAILWIND_PALETTE.indigo[500], TAILWIND_PALETTE.orange[500]].map(
          (color, i) => (
            <Widget
              key={i}
              {...args}
              iconColor={color}
            >
              <Text as="p" color="bg-600">
                This is a widget with an icon color.
              </Text>
            </Widget>
          )
        )}
      </Grid>
    </ScrollableStory>
  )
}

export const WithActionComponent: Story = {
  args: {
    actionComponent: <Button icon="tabler:plus" p="sm" variant="plain" />,
    icon: 'tabler:cube',
    title: 'A Cool Widget'
  },
  render: args => (
    <Grid columns={2} gap="lg" rows={3}>
      <Widget {...args}>
        <Text as="p" color="bg-600">
          This widget has a plus button beside the title. When clicked, maybe a
          modal appears?
        </Text>
      </Widget>
      <Widget
        actionComponent={
          <Button icon="tabler:chevron-right" p="sm" variant="plain" />
        }
        icon="tabler:cube"
        title="Another Cool Widget"
      >
        <Text as="p" color="bg-600">
          This widget has an action button that can be clicked to navigate to
          view more details.
        </Text>
      </Widget>
      <Box gridColumnSpan={2} gridRowSpan={2}>
        <Widget
          actionComponent={
            <Listbox
              bg={{ base: 'bg-100', dark: 'bg-800' }}
              maxWidth="14em"
              renderContent={() => <>Last 7 Days</>}
              value="last_7_days"
              onChange={() => {}}
            >
              <ListboxOption label="Last 24 Hours" value="last_24_hours" />
              <ListboxOption label="Last 7 Days" value="last_7_days" />
              <ListboxOption label="Last 30 Days" value="last_30_days" />
              <ListboxOption label="Last 90 Days" value="last_90_days" />
            </Listbox>
          }
          icon="tabler:cube"
          title="Widget with Listbox"
        >
          <Text as="p" color="bg-600">
            This widget has a listbox beside the title for filtering the
            displayed data. Especially useful for time range filters for
            statistics chart etc.
          </Text>
        </Widget>
      </Box>
    </Grid>
  )
}

export const LargeIconVariant: Story = {
  args: {
    icon: 'tabler:flame',
    title: 'Longest Streak',
    variant: 'large-icon'
  },
  render: args => (
    <Box minWidth="16em">
      <Widget {...args}>
        <Text as="p" size="3xl" weight="semibold">
          69 days
        </Text>
      </Widget>
    </Box>
  )
}

export const LargeIconWithIconColor: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'A Cool Widget',
    variant: 'large-icon'
  },
  render: args => (
    <ScrollableStory>
      <Grid columns={2} gap="md">
        {[TAILWIND_PALETTE.red[500], TAILWIND_PALETTE.blue[500], TAILWIND_PALETTE.green[500], TAILWIND_PALETTE.yellow[500], TAILWIND_PALETTE.purple[500], TAILWIND_PALETTE.pink[500]].map(
          (color, i) => (
            <Widget
              key={i}
              {...args}
              iconColor={color}
            >
              <Text as="p" color="bg-600">
                This is a large icon variant widget.
              </Text>
            </Widget>
          )
        )}
      </Grid>
    </ScrollableStory>
  )
}
