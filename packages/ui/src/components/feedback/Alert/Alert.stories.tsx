import type { Meta, StoryObj } from '@storybook/react-vite'

import { Box } from '@/components/primitives'

import { Alert } from './index'

const meta = {
  argTypes: {
    children: {
      control: false
    }
  },
  component: Alert
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Note: Story = {
  args: {
    children:
      'Useful information that users should be aware of, even when skimming content.',
    type: 'note'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Warning: Story = {
  args: {
    children:
      'Urgent info that needs immediate user attention to avoid problems.',
    type: 'warning'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Tip: Story = {
  args: {
    children: 'Helpful advices for doing things better or more easily.',
    type: 'tip'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Caution: Story = {
  args: {
    children: 'Advise about risks or negative outcomes of certain actions.',
    type: 'caution'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}

export const Important: Story = {
  args: {
    children: 'Key information that users need to know to achieve their goal.',
    type: 'important'
  },
  render: args => (
    <Box p="xl" width="600px">
      <Alert {...args} />
    </Box>
  )
}
