import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Grid, Text } from '@/components/primitives'

import { Stack } from './index'

const meta = {
  component: Stack
} satisfies Meta<typeof Stack>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: () => (
    <Stack>
      <Box bg={{ base: 'bg-200', dark: 'bg-700' }} p="md" r="md">
        <Text>Item 1</Text>
      </Box>
      <Box bg={{ base: 'bg-200', dark: 'bg-700' }} p="md" r="md">
        <Text>Item 2</Text>
      </Box>
      <Box bg={{ base: 'bg-200', dark: 'bg-700' }} p="md" r="md">
        <Text>Item 3</Text>
      </Box>
    </Stack>
  )
}

export const NestedStacks: Story = {
  args: {},
  render: () => (
    <Grid gap="md" templateCols={3}>
      <Stack>
        <Text weight="semibold">Column A</Text>
        <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="md">
          <Text>A1</Text>
        </Box>
        <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="md">
          <Text>A2</Text>
        </Box>
      </Stack>
      <Stack>
        <Text weight="semibold">Column B</Text>
        <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="md">
          <Text>B1</Text>
        </Box>
        <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="md">
          <Text>B2</Text>
        </Box>
        <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="md">
          <Text>B3</Text>
        </Box>
      </Stack>
      <Stack>
        <Text weight="semibold">Column C</Text>
        <Box bg={{ base: 'custom-100', dark: 'custom-900' }} p="md" r="md">
          <Text>C1</Text>
        </Box>
      </Stack>
    </Grid>
  )
}
