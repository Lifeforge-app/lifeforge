import type { Meta, StoryObj } from '@storybook/react-vite'
import COLORS from 'tailwindcss/colors'

import { Button, Listbox, ListboxOption } from '@components/inputs'
import { Box, Grid, Text } from '@components/primitives'

import Widget from './Widget'

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
    <Grid
      columns="repeat(3, minmax(0, 1fr))"
      gap="lg"
      height="100%"
      p="3xl"
      rows="repeat(3, minmax(0, 1fr))"
      width="100%"
    >
      <Widget {...args}>
        <Text as="p" color="bg-600">
          This is a dashboard item.
        </Text>
      </Widget>
      <Box gridColumn="span 2 / span 2" gridRow="span 2 / span 2">
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a larger dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridRow="span 2 / span 2">
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a tall dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridColumn="span 2 / span 2">
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
    icon: 'tabler:cube',
    title: 'Cool Widget',
    description: 'Cool Widget Description'
  },
  render: args => (
    <Grid
      columns="repeat(3, minmax(0, 1fr))"
      gap="lg"
      height="100%"
      p="3xl"
      rows="repeat(3, minmax(0, 1fr))"
      width="100%"
    >
      <Widget {...args}>
        <Text as="p" color="bg-600">
          This is a dashboard item.
        </Text>
      </Widget>
      <Box gridColumn="span 2 / span 2" gridRow="span 2 / span 2">
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a larger dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridRow="span 2 / span 2">
        <Widget {...args}>
          <Text as="p" color="bg-600">
            This is a tall dashboard item.
          </Text>
        </Widget>
      </Box>
      <Box gridColumn="span 2 / span 2">
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
    <Grid
      columns="repeat(2, minmax(0, 1fr))"
      height="100%"
      mb="3xl"
      px="3xl"
      rows="repeat(2, minmax(0, 1fr))"
      style={{ gap: '0.75rem', marginTop: '30%' }}
      width="100%"
    >
      {Object.keys(COLORS)
        .filter(color => COLORS[color as keyof typeof COLORS][500])
        .map(color => (
          <Widget
            key={color}
            {...args}
            iconColor={COLORS[color as keyof typeof COLORS][500]}
          >
            <Text as="p" color="bg-600">
              This is a widget with an icon color.
            </Text>
          </Widget>
        ))}
    </Grid>
  )
}

export const WithActionComponent: Story = {
  args: {
    icon: 'tabler:cube',
    title: 'A Cool Widget',
    actionComponent: (
      <Button className="p-2!" icon="tabler:plus" variant="plain" />
    )
  },
  render: args => (
    <Grid
      columns="repeat(2, minmax(0, 1fr))"
      gap="lg"
      height="100%"
      p="3xl"
      rows="repeat(2, minmax(0, 1fr))"
      width="100%"
    >
      <Widget {...args}>
        <Text as="p" color="bg-600">
          This widget has a plus button beside the title. When clicked, maybe a
          modal appears?
        </Text>
      </Widget>
      <Widget
        actionComponent={
          <Button
            className="p-2!"
            icon="tabler:chevron-right"
            variant="plain"
          />
        }
        icon="tabler:cube"
        title="Another Cool Widget"
      >
        <Text as="p" color="bg-600">
          This widget has an action button that can be clicked to navigate to
          view more details.
        </Text>
      </Widget>
      <Box gridColumn="span 2 / span 2">
        <Widget
          actionComponent={
            <Listbox
              buttonContent={<>Last 7 Days</>}
              className="component-bg-lighter max-w-56"
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
    <Grid
      columns="repeat(2, minmax(0, 1fr))"
      height="100%"
      mb="3xl"
      px="3xl"
      rows="repeat(2, minmax(0, 1fr))"
      style={{ gap: '0.75rem', marginTop: '75%' }}
      width="100%"
    >
      {Object.keys(COLORS)
        .filter(color => COLORS[color as keyof typeof COLORS][500])
        .map(color => (
          <Widget
            key={color}
            {...args}
            iconColor={COLORS[color as keyof typeof COLORS][500]}
          >
            <Text as="p" color="bg-600">
              This is a large icon variant widget.
            </Text>
          </Widget>
        ))}
    </Grid>
  )
}
